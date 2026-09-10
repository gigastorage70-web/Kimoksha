import { NextResponse } from 'next/server';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET(request, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer
        .from('rate_decks')
        .select('*')
        .eq('download_token', token)
        .eq('is_active', true)
        .single();

      if (data) {
        // Increment download counter
        await supabaseServer
          .from('rate_decks')
          .update({ download_count: (data.download_count || 0) + 1 })
          .eq('id', data.id);
      }
    }

    // In production, serve the file stream or redirect to signed Supabase Storage URL
    return new Response(
      'Destination,Country Code,Prefix,Rate/Min (EUR),SLA,CLI Supported\nUnited Kingdom,44,447,0.0142,99.99%,Yes\nFrance,33,336,0.0210,99.99%,Yes\nUnited Arab Emirates,971,9715,0.0385,99.99%,Yes\nSingapore,65,658,0.0195,99.99%,Yes\nGermany,49,491,0.0165,99.99%,Yes\n',
      {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="Kimoksha_Wholesale_Rate_Deck_${token}.csv"`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
  }
}
