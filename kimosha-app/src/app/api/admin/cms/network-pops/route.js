import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

let mockPops = [
  {
    id: 'pop-001',
    pop_code: 'DX1',
    name: 'Equinix DX1 Carrier Hub',
    city: 'Dubai',
    country: 'United Arab Emirates',
    latitude: 25.2048,
    longitude: 55.2708,
    status: 'ONLINE',
    latency_ms: 18,
    supported_protocols: 'SMPP 3.4, SIP 2.0 Trunking, REST API',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'pop-002',
    pop_code: 'LD4',
    name: 'Equinix LD4 Slough Exchange',
    city: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    status: 'ONLINE',
    latency_ms: 12,
    supported_protocols: 'SIP Trunking, TDM, Direct SS7 Interconnect',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'pop-003',
    pop_code: 'FR2',
    name: 'Equinix FR2 Frankfurt Central',
    city: 'Frankfurt',
    country: 'Germany',
    latitude: 50.1109,
    longitude: 8.6821,
    status: 'ONLINE',
    latency_ms: 14,
    supported_protocols: 'A2P SMS Gateway, Dynamic LCR Routing',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'pop-004',
    pop_code: 'SG1',
    name: 'Equinix SG1 Asia-Pacific Gateway',
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    status: 'ONLINE',
    latency_ms: 22,
    supported_protocols: 'SMPP 3.4 Transceiver, High-Throughput OTP',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'pop-005',
    pop_code: 'NY4',
    name: 'Equinix NY4 Secaucus Hub',
    city: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.006,
    status: 'ONLINE',
    latency_ms: 68,
    supported_protocols: 'SIP VoIP, REST Webhooks, Diameter Signaling',
    display_order: 5,
    is_active: true,
  },
];

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('network_pops')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, pops: data });
      }
    }

    return NextResponse.json({ success: true, pops: mockPops });
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
