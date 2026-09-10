import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

let mockAuditLogs = [
  {
    id: 'log-001',
    operator_username: 'admin',
    ip_address: '192.168.1.45',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    details: '{"session_duration": 1800}',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'log-002',
    operator_username: 'admin',
    ip_address: '192.168.1.45',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    action: 'CMS_CONTENT_UPDATE',
    status: 'SUCCESS',
    details: '{"section": "hero_counters"}',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'log-003',
    operator_username: 'unknown_bot',
    ip_address: '185.220.101.5',
    user_agent: 'python-requests/2.31.0',
    action: 'LOGIN_FAILED',
    status: 'WARNING',
    details: '{"reason": "Invalid credentials", "attempt": 1}',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'log-004',
    operator_username: 'unknown_bot',
    ip_address: '185.220.101.5',
    user_agent: 'python-requests/2.31.0',
    action: 'BRUTE_FORCE_LOCKOUT',
    status: 'FAILED',
    details: '{"attempts": 7, "lockout_mins": 30}',
    created_at: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
  },
  {
    id: 'log-005',
    operator_username: 'admin',
    ip_address: '192.168.1.45',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    action: 'RATE_DECK_UPLOAD',
    status: 'SUCCESS',
    details: '{"file": "Kimoksha_AZ_SMS_Direct_Q3_2026.xlsx"}',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

let mockBlockedIps = [
  {
    id: 'block-001',
    ip_address: '185.220.101.5',
    reason: 'Automated lockout: 7 consecutive failed login attempts',
    failed_attempts: 7,
    blocked_until: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
    is_permanent: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'block-002',
    ip_address: '45.154.255.89',
    reason: 'Suspicious credential stuffing on carrier gateway',
    failed_attempts: 14,
    blocked_until: null,
    is_permanent: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function GET(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let logs = [];
    let blockedIps = [];

    if (isSupabaseConfigured()) {
      const [logsRes, ipsRes] = await Promise.all([
        supabaseServer
          .from('security_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        supabaseServer
          .from('blocked_ips')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (!logsRes.error && logsRes.data) {
        logs = logsRes.data;
      }
      if (!ipsRes.error && ipsRes.data) {
        blockedIps = ipsRes.data;
      }
    } else {
      logs = mockAuditLogs;
      blockedIps = mockBlockedIps;
    }

    return NextResponse.json({
      success: true,
      logs,
      blockedIps,
      securityShield: {
        lockoutThreshold: 7,
        lockoutDurationMin: 30,
        currentBlockedCount: blockedIps.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ip_address, reason, is_permanent } = body;

    if (action === 'BLOCK_IP') {
      if (!ip_address) {
        return NextResponse.json({ success: false, error: 'IP address is required' }, { status: 400 });
      }

      const newBlock = {
        id: `block-${Date.now()}`,
        ip_address,
        reason: reason || 'Manual operator blacklist',
        failed_attempts: 1,
        blocked_until: is_permanent ? null : new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        is_permanent: !!is_permanent,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        await supabaseServer.from('blocked_ips').upsert(newBlock, { onConflict: 'ip_address' });
      } else {
        mockBlockedIps = [newBlock, ...mockBlockedIps.filter((b) => b.ip_address !== ip_address)];
      }

      await logSecurityAudit({
        username: operator.username,
        action: 'MANUAL_IP_BLOCK',
        status: 'WARNING',
        details: { ip: ip_address, reason, permanent: is_permanent },
      });

      return NextResponse.json({ success: true, message: `IP ${ip_address} successfully blocked` });
    }

    if (action === 'UNBLOCK_IP') {
      if (!ip_address) {
        return NextResponse.json({ success: false, error: 'IP address is required' }, { status: 400 });
      }

      if (isSupabaseConfigured()) {
        await supabaseServer.from('blocked_ips').delete().eq('ip_address', ip_address);
      } else {
        mockBlockedIps = mockBlockedIps.filter((b) => b.ip_address !== ip_address);
      }

      await logSecurityAudit({
        username: operator.username,
        action: 'MANUAL_IP_UNBLOCK',
        status: 'SUCCESS',
        details: { ip: ip_address },
      });

      return NextResponse.json({ success: true, message: `IP ${ip_address} unblocked` });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
