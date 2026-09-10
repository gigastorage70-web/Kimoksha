import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function PATCH(request, { params }) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const allowed = ['NEW', 'CONTACTED', 'RATE_CARD_SENT', 'TEST_BIND_PROVISIONED', 'CONVERTED', 'ARCHIVED'];
    if (!allowed.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      await supabaseServer.from('leads').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    }

    await logSecurityAudit({
      username: operator.username,
      action: 'LEAD_STATUS_UPDATED',
      status: 'SUCCESS',
      details: { lead_id: id, new_status: status },
    });

    return NextResponse.json({ success: true, message: `Lead status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
