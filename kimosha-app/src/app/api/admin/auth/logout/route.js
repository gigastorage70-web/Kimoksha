import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentOperator, logSecurityAudit } from '@/lib/auth';

export async function POST(request) {
  try {
    const operator = await getCurrentOperator();
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (operator) {
      await logSecurityAudit({
        username: operator.username,
        ip,
        userAgent: request.headers.get('user-agent') || '',
        action: 'LOGOUT',
        status: 'SUCCESS',
      });
    }

    await clearSessionCookie();
    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to sign out' }, { status: 500 });
  }
}
