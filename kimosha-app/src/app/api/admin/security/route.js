import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

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
