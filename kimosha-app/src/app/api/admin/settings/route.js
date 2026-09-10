import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

let mockSettings = {
  // Notifications & Sales Routing
  alert_email_primary: 'sales@kimokshatelco.com',
  alert_email_secondary: 'info@kimokshatelco.com',
  email_alerts_enabled: 'true',

  // Carrier Branding
  branding_company_name: 'Kimoksha Telecom',
  branding_logo_url: '/kimoksha-logo-clean.png',
  branding_favicon_url: '/Favicon.png',

  // SEO & Meta
  seo_meta_title: 'Kimoksha Telecom | Global Wholesale SMS & Voice Carrier Hub',
  seo_meta_description:
    'Connecting Tier-1 telecom operators and enterprise aggregators across 200+ countries with bilateral routing agreements and 99.99% network uptime SLA.',
  canonical_url: 'https://www.kimokshatelco.com',

  // Security Policy
  security_session_timeout_seconds: '1800',
  security_max_login_attempts: '7',

  // Infrastructure Info
  supabase_project_id: 'asazkpxgawnqhddnwqjc',
  supabase_project_name: 'Kimoksha',
};

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let settings = { ...mockSettings };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseServer.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((row) => {
          settings[row.setting_key] = row.setting_value;
        });
      }
    }

    return NextResponse.json({
      success: true,
      settings,
      supabaseStatus: {
        projectId: 'asazkpxgawnqhddnwqjc',
        projectName: 'Kimoksha',
        isConfigured: isSupabaseConfigured(),
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://asazkpxgawnqhddnwqjc.supabase.co',
      },
    });
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
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ success: false, error: 'Settings object is required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const rows = Object.entries(settings).map(([key, val]) => ({
        setting_key: key,
        setting_value: String(val),
        updated_at: new Date().toISOString(),
      }));

      await supabaseServer.from('site_settings').upsert(rows, { onConflict: 'setting_key' });
    } else {
      mockSettings = { ...mockSettings, ...settings };
    }

    await logSecurityAudit({
      username: operator.username,
      action: 'SYSTEM_SETTINGS_UPDATE',
      status: 'SUCCESS',
      details: { updated_keys: Object.keys(settings) },
    });

    return NextResponse.json({
      success: true,
      message: 'System settings updated successfully',
      settings,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
