import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';
import crypto from 'crypto';

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let rateDecks = [];

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('rate_decks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        rateDecks = data;
      }
    }

    return NextResponse.json({ success: true, rateDecks });
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
