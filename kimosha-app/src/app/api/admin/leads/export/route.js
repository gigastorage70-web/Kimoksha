import { NextResponse } from 'next/server';
import { getCurrentOperator } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let leads = [];

    if (isSupabaseConfigured()) {
      const { data } = await supabaseServer
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) leads = data;
    }

    // Header row
    let csv = 'ID,Full Name,Corporate Email,Subject,Company,Target Service,Status,Client IP,Country,Date\n';

    leads.forEach((l) => {
      const row = [
        `"${l.id}"`,
        `"${(l.full_name || '').replace(/"/g, '""')}"`,
        `"${(l.corporate_email || '').replace(/"/g, '""')}"`,
        `"${(l.subject || '').replace(/"/g, '""')}"`,
        `"${(l.company_name || '').replace(/"/g, '""')}"`,
        `"${(l.target_service || '').replace(/"/g, '""')}"`,
        `"${l.status || 'NEW'}"`,
        `"${l.ip_address || ''}"`,
        `"${l.geo_country || ''}"`,
        `"${new Date(l.created_at).toISOString()}"`,
      ];
      csv += row.join(',') + '\n';
    });

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kimoksha_leads_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
