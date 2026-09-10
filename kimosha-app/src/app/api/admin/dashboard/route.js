import { NextResponse } from 'next/server';
import { getCurrentOperator } from '@/lib/auth';
import { supabaseServer, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const operator = await getCurrentOperator();
    if (!operator) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let leadsCount = 0;
    let newLeadsCount = 0;
    let rateDecksCount = 0;
    let recentLeads = [];
    let pops = [];
    let serviceInterestDistribution = [];
    let uptimeSla = '99.99%';
    let bilateralMnoBinds = '500+';

    if (isSupabaseConfigured()) {
      try {
        // Count total leads
        const { count: totalLeads } = await supabaseServer
          .from('leads')
          .select('*', { count: 'exact', head: true });
        if (totalLeads !== null && totalLeads !== undefined) leadsCount = totalLeads;

        // Count new leads
        const { count: newCount } = await supabaseServer
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'NEW');
        if (newCount !== null && newCount !== undefined) newLeadsCount = newCount;

        // Count rate decks
        const { count: decksCount } = await supabaseServer
          .from('rate_decks')
          .select('*', { count: 'exact', head: true });
        if (decksCount !== null && decksCount !== undefined) rateDecksCount = decksCount;

        // Fetch recent leads
        const { data: latest } = await supabaseServer
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        if (latest) recentLeads = latest;

        // Fetch PoPs
        const { data: popData } = await supabaseServer
          .from('network_pops')
          .select('*')
          .order('display_order', { ascending: true });
        if (popData && popData.length > 0) pops = popData;

        // Dynamic Service Interest Distribution from real incoming leads
        const { data: allLeadsServices } = await supabaseServer
          .from('leads')
          .select('target_service');
        if (allLeadsServices && allLeadsServices.length > 0) {
          const counts = {};
          allLeadsServices.forEach((l) => {
            const svc = l.target_service || 'General Interconnect';
            counts[svc] = (counts[svc] || 0) + 1;
          });
          const total = allLeadsServices.length;
          serviceInterestDistribution = Object.entries(counts).map(([service, count]) => ({
            service,
            count,
            percentage: Math.round((count / total) * 100),
          }));
        }

        // Live telemetry values synced from CMS site_content
        const { data: cmsHero } = await supabaseServer
          .from('site_content')
          .select('payload')
          .eq('section_key', 'hero_counters')
          .maybeSingle();
        if (cmsHero?.payload) {
          if (cmsHero.payload.network_uptime_sla) uptimeSla = cmsHero.payload.network_uptime_sla;
          if (cmsHero.payload.direct_mno_binds) bilateralMnoBinds = cmsHero.payload.direct_mno_binds;
        }
      } catch (e) {
        console.error('Supabase dashboard query error:', e);
      }
    }

    // Default empty state if no distribution yet
    if (serviceInterestDistribution.length === 0) {
      serviceInterestDistribution = [
        { service: 'Wholesale SMS Termination', count: leadsCount > 0 ? leadsCount : 0, percentage: 100 },
      ];
    }

    return NextResponse.json({
      success: true,
      telemetry: {
        totalLeads: leadsCount,
        newLeads: newLeadsCount,
        activeRateDecks: rateDecksCount,
        uptimeSla,
        bilateralMnoBinds,
      },
      pops,
      recentLeads,
      serviceInterestDistribution,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Dashboard error' }, { status: 500 });
  }
}
