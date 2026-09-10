import { NextResponse } from 'next/server';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

const DEFAULT_CONTENT = {
  hero_counters: {
    connected_countries: '200+',
    direct_mno_binds: '500+',
    network_uptime_sla: '99.99%',
    daily_sms_volume: '150M+',
  },
  services_specs: {
    smpp_tps_max: '10,000 TPS',
    voice_codecs: 'G.711a, G.711u, G.729a, OPUS',
    post_dial_delay_max: 'Sub-120ms PDD',
    ss7_jitter_sla: '< 15ms Jitter',
    direct_ss7_interconnects: '99.99% Call Completion',
  },
  carrier_marquee: {
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
  testimonials: {
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
  legal_escalation: {
    emergency_noc_phone: '+971 4 299 0000',
    emergency_noc_email: 'noc@kimokshatelco.com',
    tier1_response_min: '15 Minutes',
    tier2_response_min: '30 Minutes',
    tier3_response_min: '60 Minutes',
    sla_uptime_target: '99.99%',
    escalation_lead_name: 'Ahmed Al-Mansoor (Chief Network Engineer)',
  },
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (isSupabaseConfigured()) {
      let query = supabaseServer.from('site_content').select('section_key, payload').eq('is_visible', true);
      if (section) {
        query = query.eq('section_key', section).single();
      }

      const { data, error } = await query;
      if (!error && data) {
        if (section && data.payload) {
          return NextResponse.json({ success: true, [section]: data.payload });
        }
        if (Array.isArray(data) && data.length > 0) {
          const result = {};
          data.forEach((row) => {
            result[row.section_key] = row.payload;
          });
          return NextResponse.json({ success: true, content: { ...DEFAULT_CONTENT, ...result } });
        }
      }
    }

    if (section) {
      return NextResponse.json({ success: true, [section]: DEFAULT_CONTENT[section] || {} });
    }

    return NextResponse.json({ success: true, content: DEFAULT_CONTENT });
  } catch (error) {
    return NextResponse.json({ success: true, content: DEFAULT_CONTENT });
  }
}
