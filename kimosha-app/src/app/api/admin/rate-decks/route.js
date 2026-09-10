import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';
import crypto from 'crypto';

let mockRateDecks = [
  {
    id: 'rd-001',
    title: 'Kimoksha Wholesale A-Z SMS Premium Direct Routes',
    service_type: 'A2P_SMS_WHOLESALE',
    file_name: 'Kimoksha_AZ_SMS_Direct_Q3_2026.xlsx',
    file_url: '/sample-rate-deck.xlsx',
    file_size_bytes: 2458900,
    version_tag: 'v2026.09-Q3',
    currency: 'EUR',
    effective_date: '2026-09-01',
    is_active: true,
    download_token: 'tok_sms_direct_a7f9b8c2',
    download_count: 48,
    uploaded_by: 'Kimoksha Pricing Desk',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'rd-002',
    title: 'Global Direct CLI Voice Termination Sheet (Tier-1 MNOs)',
    service_type: 'VOICE_CLI_PREMIUM',
    file_name: 'Kimoksha_Voice_Direct_CLI_v4.2.xlsx',
    file_url: '/sample-voice-rate.xlsx',
    file_size_bytes: 3890120,
    version_tag: 'v2026.09-Q3-v4.2',
    currency: 'USD',
    effective_date: '2026-09-10',
    is_active: true,
    download_token: 'tok_voice_cli_e8d1c4a9',
    download_count: 32,
    uploaded_by: 'NOC Routing Desk',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'rd-003',
    title: 'Wholesale Non-CLI Least-Cost Routing (LCR) Minutes',
    service_type: 'VOICE_DIRECT_LCR',
    file_name: 'Kimoksha_Voice_LCR_Global_Q3.csv',
    file_url: '/sample-lcr.csv',
    file_size_bytes: 1420500,
    version_tag: 'v2026.08-LCR',
    currency: 'USD',
    effective_date: '2026-08-15',
    is_active: true,
    download_token: 'tok_voice_lcr_9b4f2a11',
    download_count: 67,
    uploaded_by: 'Kimoksha Pricing Desk',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
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
        .from('rate_decks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, rateDecks: data });
      }
    }

    return NextResponse.json({ success: true, rateDecks: mockRateDecks });
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
    const { title, service_type, file_name, version_tag, currency, effective_date } = body;

    if (!title || !service_type || !file_name || !version_tag) {
      return NextResponse.json(
        { success: false, error: 'Title, service type, file name, and version tag are required.' },
        { status: 400 }
      );
    }

    const download_token = `tok_${crypto.randomBytes(8).toString('hex')}`;

    const newDeck = {
      id: `rd-${Date.now()}`,
      title,
      service_type,
      file_name,
      file_url: `/uploads/${file_name}`,
      file_size_bytes: Math.floor(Math.random() * 2000000) + 1000000,
      version_tag,
      currency: currency || 'EUR',
      effective_date: effective_date || new Date().toISOString().slice(0, 10),
      is_active: true,
      download_token,
      download_count: 0,
      uploaded_by: operator.username,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabaseServer.from('rate_decks').insert(newDeck);
    } else {
      mockRateDecks.unshift(newDeck);
    }

    await logSecurityAudit({
      username: operator.username,
      action: 'RATE_DECK_UPLOAD',
      status: 'SUCCESS',
      details: { title, version: version_tag, token: download_token },
    });

    return NextResponse.json({ success: true, rateDeck: newDeck });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
