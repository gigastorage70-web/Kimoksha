import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let pops = [];

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('network_pops')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        pops = data;
      }
    }

    return NextResponse.json({ success: true, pops });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pop_code, status, latency_ms, supported_protocols } = body;

    if (!pop_code) {
      return NextResponse.json({ success: false, error: 'pop_code is required' }, { status: 400 });
    }

    const updateFields = {
      updated_at: new Date().toISOString(),
    };
    if (status !== undefined) updateFields.status = status;
    if (latency_ms !== undefined) updateFields.latency_ms = Number(latency_ms);
    if (supported_protocols !== undefined) updateFields.supported_protocols = supported_protocols;

    if (isSupabaseConfigured()) {
      await supabaseServer
        .from('network_pops')
        .update(updateFields)
        .eq('pop_code', pop_code);
    } else {
      const index = mockPops.findIndex((p) => p.pop_code === pop_code);
      if (index !== -1) {
        mockPops[index] = { ...mockPops[index], ...updateFields };
      }
    }

    await logSecurityAudit({
      username: operator.username,
      action: 'NETWORK_POP_UPDATE',
      status: 'SUCCESS',
      details: { pop_code, ...updateFields },
    });

    return NextResponse.json({
      success: true,
      message: `Exchange Node ${pop_code} updated successfully`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
