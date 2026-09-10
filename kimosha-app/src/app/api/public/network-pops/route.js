import { NextResponse } from 'next/server';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

const DEFAULT_POPS = [
  {
    pop_code: 'DX1',
    name: 'Equinix DX1 Carrier Hub',
    city: 'Dubai',
    country: 'UAE',
    status: 'ONLINE',
    latency_ms: 18,
    supported_protocols: 'SMPP 3.4, SIP 2.0 Trunking, REST API',
  },
  {
    pop_code: 'LD4',
    name: 'Equinix LD4 Slough Exchange',
    city: 'London',
    country: 'UK',
    status: 'ONLINE',
    latency_ms: 12,
    supported_protocols: 'SIP Trunking, TDM, Direct SS7 Interconnect',
  },
  {
    pop_code: 'FR2',
    name: 'Equinix FR2 Frankfurt Central',
    city: 'Frankfurt',
    country: 'Germany',
    status: 'ONLINE',
    latency_ms: 14,
    supported_protocols: 'A2P SMS Gateway, Dynamic LCR Routing',
  },
  {
    pop_code: 'SG1',
    name: 'Equinix SG1 Asia-Pacific Gateway',
    city: 'Singapore',
    country: 'Singapore',
    status: 'ONLINE',
    latency_ms: 22,
    supported_protocols: 'SMPP 3.4 Transceiver, High-Throughput OTP',
  },
  {
    pop_code: 'NY4',
    name: 'Equinix NY4 Secaucus Hub',
    city: 'New York',
    country: 'USA',
    status: 'ONLINE',
    latency_ms: 68,
    supported_protocols: 'SIP VoIP, REST Webhooks, Diameter Signaling',
  },
];

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('network_pops')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, pops: data });
      }
    }

    return NextResponse.json({ success: true, pops: DEFAULT_POPS });
  } catch (error) {
    return NextResponse.json({ success: true, pops: DEFAULT_POPS });
  }
}
