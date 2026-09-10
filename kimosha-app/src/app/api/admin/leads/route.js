import { NextResponse } from 'next/server';
import { getCurrentOperator } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

// Mock memory store if Supabase credentials not yet provided
let mockLeads = [
  {
    id: 'lead-001',
    full_name: 'Alexandre Dubois',
    corporate_email: 'a.dubois@orange-carrier.fr',
    subject: 'Wholesale A2P SMS Termination Request (France & EU)',
    message: 'We are seeking 1-hop direct operator routes into France and Benelux with guaranteed CLI transparency. Monthly volume estimate: 8.5M OTP messages.',
    company_name: 'Orange Wholesale Partner',
    target_service: 'A2P Enterprise Messaging',
    status: 'NEW',
    assigned_to: null,
    ip_address: '194.206.124.5',
    geo_country: 'France',
    geo_city: 'Paris',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'lead-002',
    full_name: 'Tariq Al-Mansoor',
    corporate_email: 'tariq@telecom-gulf.ae',
    subject: 'SMPP v3.4 Transceiver Bind Interconnect DX1',
    message: 'Need 4x TRX binds at Equinix DX1 Dubai with 1,500 TPS capacity. Looking to receive your latest GCC rate card.',
    company_name: 'Gulf Carrier Telecom',
    target_service: 'SMPP 3.4 & API Platform',
    status: 'RATE_CARD_SENT',
    assigned_to: 'admin',
    ip_address: '94.200.115.18',
    geo_country: 'United Arab Emirates',
    geo_city: 'Dubai',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'lead-003',
    full_name: 'Marcus Sterling',
    corporate_email: 'm.sterling@vodafone-partner.co.uk',
    subject: 'SIP Trunking CLI Direct Termination (UK & Ireland)',
    message: 'Requesting wholesale SIP interconnect over private cross-connect in LD4 Slough. Requirement is 300 concurrent channels with G.711 / G.729 codecs.',
    company_name: 'Sterling Voice Ltd',
    target_service: 'Voice Termination (VoIP/TDM)',
    status: 'CONTACTED',
    assigned_to: 'sales_lead',
    ip_address: '82.165.197.1',
    geo_country: 'United Kingdom',
    geo_city: 'London',
    created_at: new Date(Date.now() - 1000 * 60 * 340).toISOString(),
  },
  {
    id: 'lead-004',
    full_name: 'Hans Zimmer',
    corporate_email: 'hzimmer@de-telecom.de',
    subject: 'Bilateral Voice Swap Agreement Request',
    message: 'We can trade 2M minutes of DACH region wholesale voice for UK/US termination. Please review attached traffic profile.',
    company_name: 'DE Telecom Exchange',
    target_service: 'Voice Termination (VoIP/TDM)',
    status: 'TEST_BIND_PROVISIONED',
    assigned_to: 'noc_desk',
    ip_address: '178.63.85.12',
    geo_country: 'Germany',
    geo_city: 'Frankfurt',
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
  },
  {
    id: 'lead-005',
    full_name: 'David Chen',
    corporate_email: 'd.chen@sing-carrier.sg',
    subject: 'A-Z Wholesale SMS Route Interconnect',
    message: 'Direct SS7 interconnect for South East Asia (Malaysia, Indonesia, Thailand). Please dispatch A-Z sheet.',
    company_name: 'SingHub Telecom',
    target_service: 'Wholesale SMS Termination',
    status: 'CONVERTED',
    assigned_to: 'admin',
    ip_address: '103.28.248.1',
    geo_country: 'Singapore',
    geo_city: 'Singapore',
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
  },
];

export async function GET(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'ALL';
    const search = (searchParams.get('search') || '').toLowerCase();

    let leads = [];

    if (isSupabaseConfigured()) {
      let query = supabaseServer
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (status !== 'ALL') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (!error && data) {
        leads = data;
      }
    } else {
      leads = mockLeads;
      if (status !== 'ALL') {
        leads = leads.filter((l) => l.status === status);
      }
    }

    if (search) {
      leads = leads.filter(
        (l) =>
          l.full_name?.toLowerCase().includes(search) ||
          l.corporate_email?.toLowerCase().includes(search) ||
          l.subject?.toLowerCase().includes(search) ||
          l.company_name?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
