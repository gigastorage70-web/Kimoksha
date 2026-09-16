import { NextResponse } from 'next/server';
import {
  authenticateOperator,
  createSessionToken,
  setSessionCookie,
  checkIpBruteForce,
  recordLoginAttempt,
  logSecurityAudit,
} from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    // 1. Check brute-force lockout status (7 failed attempts)
    const bruteCheck = await checkIpBruteForce(ip);
    if (bruteCheck.isBlocked) {
      await logSecurityAudit({
        username,
        ip,
        userAgent,
        action: 'LOGIN_BLOCKED',
        status: 'WARNING',
        details: { reason: bruteCheck.reason },
      });
      return NextResponse.json(
        { success: false, error: bruteCheck.reason },
        { status: 429 }
      );
    }

    // 2. Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // 3. Authenticate operator
    const operator = await authenticateOperator(username, password);

    if (!operator) {
      await recordLoginAttempt(ip, false);
      await logSecurityAudit({
        username,
        ip,
        userAgent,
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        details: { reason: 'Invalid credentials' },
      });

      return NextResponse.json(
        { success: false, error: 'Invalid operator credentials. Access attempt logged.' },
        { status: 401 }
      );
    }

    // 4. Success: clear attempts, set session cookie, and log audit event
    await recordLoginAttempt(ip, true);

    if (isSupabaseConfigured() && operator.id) {
      try {
        await supabaseServer
          .from('admin_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', operator.id);
      } catch (e) {}
    }

    const token = await createSessionToken(operator);
    await setSessionCookie(token);

    await logSecurityAudit({
      username: operator.username,
      ip,
      userAgent,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      details: { role: operator.role },
    });

    return NextResponse.json({
      success: true,
      message: 'Authentication successful. Redirecting to command center...',
      operator: {
        id: operator.id,
        username: operator.username,
        email: operator.email,
        role: operator.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal authentication error' }, { status: 500 });
  }
}
