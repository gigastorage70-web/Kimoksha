import { NextResponse } from 'next/server';
import { getCurrentOperator } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

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
