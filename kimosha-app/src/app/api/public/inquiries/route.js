import { NextResponse } from 'next/server';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, company, service } = body;

    if (!name || !email || !subject) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and subject are required.' },
        { status: 400 }
      );
    }

    // Extract client IP and user-agent
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';
    const geoCountry = request.headers.get('x-vercel-ip-country') || 'International';

    const newLead = {
      full_name: name.trim(),
      corporate_email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message ? message.trim() : null,
      company_name: company || null,
      target_service: service || 'General Carrier Inquiry',
      status: 'NEW',
      ip_address: ip,
      geo_country: geoCountry,
      user_agent: userAgent,
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer.from('leads').insert(newLead).select().single();
      if (error) {
        console.error('Supabase leads insert error:', error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry received. A Kimoksha telecom carrier specialist will be in touch within 60 minutes.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Inquiries API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
