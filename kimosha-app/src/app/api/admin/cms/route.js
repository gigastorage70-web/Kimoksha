import { NextResponse } from 'next/server';
import { getCurrentOperator, logSecurityAudit } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

let mockCmsContent = {
  hero_counters: {
    title: 'Hero Metric Ribbons',
    subtitle: 'Live counters rendered on Kimoksha Homepage',
    payload: {
      connected_countries: '200+',
      direct_mno_binds: '500+',
      network_uptime_sla: '99.99%',
      daily_sms_volume: '150M+',
    },
    updated_at: new Date().toISOString(),
  },
  services_specs: {
    title: 'Technical SLA Specifications',
    subtitle: 'Configurable enterprise technical parameters',
    payload: {
      smpp_tps_max: '10,000 TPS',
      voice_codecs: 'G.711a, G.711u, G.729a, OPUS',
      post_dial_delay_max: 'Sub-120ms PDD',
      ss7_jitter_sla: '< 15ms Jitter',
      direct_ss7_interconnects: '99.99% Call Completion',
    },
    updated_at: new Date().toISOString(),
  },
  carrier_marquee: {
    title: 'Carrier Partner Marquee',
    subtitle: 'Tier-1 Telecom Operators featured on homepage marquee',
    payload: {
      partners: [
        { id: 1, name: 'Vodafone Carrier Services', tier: 'Tier-1', region: 'Global', active: true },
        { id: 2, name: 'Orange Wholesale International', tier: 'Tier-1', region: 'Europe & Africa', active: true },
        { id: 3, name: 'Telefonica Global Solutions', tier: 'Tier-1', region: 'LatAm & Europe', active: true },
        { id: 4, name: 'Singtel International Carrier', tier: 'Tier-1', region: 'Asia-Pacific', active: true },
        { id: 5, name: 'Etisalat Carrier & Wholesale', tier: 'Tier-1', region: 'Middle East', active: true },
        { id: 6, name: 'Tata Communications', tier: 'Tier-1', region: 'Global Transatlantic', active: true },
        { id: 7, name: 'Bharti Airtel Global', tier: 'Tier-1', region: 'South Asia & Africa', active: true },
        { id: 8, name: 'Deutsche Telekom Global Carrier', tier: 'Tier-1', region: 'Europe', active: true },
      ],
    },
    updated_at: new Date().toISOString(),
  },
  testimonials: {
    title: 'Enterprise Testimonials',
    subtitle: 'Verified wholesale carrier and fintech endorsements',
    payload: {
      items: [
        {
          id: 1,
          author: 'Marcus Vance',
          role: 'VP Global Interconnect',
          company: 'Aether Mobile UK',
          rating: 5,
          quote: 'Kimoksha reduced our A2P OTP delivery latency across Southeast Asia by 38%. Their DX1 and SG1 direct binds have zero jitter.',
          date: 'August 2026',
          active: true,
        },
        {
          id: 2,
          author: 'Elena Rostova',
          role: 'Head of Wholesale Voice',
          company: 'EuroTel International',
          rating: 5,
          quote: 'Premium CLI route quality with automated PDD failover. Their team in Dubai resolved our bilateral interconnect in less than 48 hours.',
          date: 'July 2026',
          active: true,
        },
      ],
    },
    updated_at: new Date().toISOString(),
  },
  legal_escalation: {
    title: 'NOC Escalation & Support Directory',
    subtitle: 'Emergency dispatch numbers and shift escalation matrix',
    payload: {
      emergency_noc_phone: '+971 4 299 0000',
      emergency_noc_email: 'noc@kimokshatelco.com',
      tier1_response_min: '15 Minutes',
      tier2_response_min: '30 Minutes',
      tier3_response_min: '60 Minutes',
      sla_uptime_target: '99.99%',
      escalation_lead_name: 'Ahmed Al-Mansoor (Chief Network Engineer)',
    },
    updated_at: new Date().toISOString(),
  },
};

export async function GET(request) {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (isSupabaseConfigured()) {
      let query = supabaseServer.from('site_content').select('*');
      if (section) {
        query = query.eq('section_key', section).single();
      }

      const { data, error } = await query;
      if (!error && data) {
        if (section) {
          return NextResponse.json({ success: true, content: data });
        } else if (Array.isArray(data) && data.length > 0) {
          const formatted = {};
          data.forEach((item) => {
            formatted[item.section_key] = item;
          });
          return NextResponse.json({ success: true, content: { ...mockCmsContent, ...formatted } });
        }
      }
    }

    if (section) {
      const single = mockCmsContent[section];
      if (!single) {
        return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, content: single });
    }

    return NextResponse.json({ success: true, content: mockCmsContent });
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
    const { section_key, title, subtitle, payload } = body;

    if (!section_key || !payload) {
      return NextResponse.json(
        { success: false, error: 'section_key and payload are required' },
        { status: 400 }
      );
    }

    const updatedRecord = {
      section_key,
      title: title || mockCmsContent[section_key]?.title || 'Dynamic Section',
      subtitle: subtitle || mockCmsContent[section_key]?.subtitle || '',
      payload,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabaseServer.from('site_content').upsert(updatedRecord, { onConflict: 'section_key' });
    } else {
      mockCmsContent[section_key] = updatedRecord;
    }

    await logSecurityAudit({
      username: operator.username,
      action: 'CMS_CONTENT_UPDATE',
      status: 'SUCCESS',
      details: { section: section_key, updated_at: updatedRecord.updated_at },
    });

    return NextResponse.json({
      success: true,
      message: `Section '${section_key}' updated successfully`,
      content: updatedRecord,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
