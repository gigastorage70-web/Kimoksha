'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Radio,
  FileSpreadsheet,
  Users,
  Activity,
  Calendar,
} from 'lucide-react';

const REGIONS = [
  { region: 'Middle East & GCC (UAE, Saudi, Qatar)', percentage: 38, count: '142 Inquiries' },
  { region: 'Europe (UK, Germany, France, Italy)', percentage: 29, count: '108 Inquiries' },
  { region: 'Asia Pacific (Singapore, Malaysia, India)', percentage: 18, count: '67 Inquiries' },
  { region: 'North America (10DLC & Shortcode)', percentage: 11, count: '41 Inquiries' },
  { region: 'Africa & Rest of World', percentage: 4, count: '16 Inquiries' },
];

const MONTHLY_TREND = [
  { month: 'Apr', leads: 22, rateDeckDownloads: 14 },
  { month: 'May', leads: 28, rateDeckDownloads: 19 },
  { month: 'Jun', leads: 35, rateDeckDownloads: 27 },
  { month: 'Jul', leads: 42, rateDeckDownloads: 34 },
  { month: 'Aug', leads: 51, rateDeckDownloads: 48 },
  { month: 'Sep', leads: 64, rateDeckDownloads: 59 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <>
      <AdminHeader
        title="Telecom Telemetry & Partner Analytics"
        subtitle="Comprehensive insight into carrier lead velocities, route inquiry demands, and bilateral rate deck distribution."
      />

      <div className="analytics-page">
        {/* KPI Strip */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Inbound Pipeline</span>
            <div className="stat-val text-orange">374 Leads</div>
            <span className="stat-sub">+24% vs. previous 30 days</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Rate Deck Gated Downloads</span>
            <div className="stat-val text-blue">201 Fetches</div>
            <span className="stat-sub">Partner token access requests</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Carrier Conversion Rate</span>
            <div className="stat-val text-green">14.8%</div>
            <span className="stat-sub">Qualified to active test bind</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Network Quality (ASR)</span>
            <div className="stat-val">94.8%</div>
            <span className="stat-sub">Answer-Seizure Ratio standard</span>
          </div>
        </div>

        {/* Dual Grid: Monthly Velocity & Regional Breakdown */}
        <div className="dual-grid">
          {/* Monthly Trend Chart */}
          <div className="chart-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Inquiry & Rate Deck Distribution Velocity</h3>
                <p className="card-sub">Growth trend over the past 6 operational cycles</p>
              </div>
              <div className="legend">
                <span className="legend-item">
                  <span className="dot orange" />
                  <span>Carrier Leads</span>
                </span>
                <span className="legend-item">
                  <span className="dot blue" />
                  <span>Deck Downloads</span>
                </span>
              </div>
            </div>

            <div className="bars-container">
              {MONTHLY_TREND.map((item) => (
                <div key={item.month} className="bar-group">
                  <div className="bar-column">
                    <div
                      className="bar-fill blue-bar"
                      style={{ height: `${(item.rateDeckDownloads / 70) * 100}%` }}
                      title={`Rate Decks: ${item.rateDeckDownloads}`}
                    />
                    <div
                      className="bar-fill orange-bar"
                      style={{ height: `${(item.leads / 70) * 100}%` }}
                      title={`Leads: ${item.leads}`}
                    />
                  </div>
                  <span className="bar-month">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Demand Distribution */}
          <div className="chart-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Regional Traffic & Route Demand</h3>
                <p className="card-sub">Geographic origin of wholesale carrier partnerships</p>
              </div>
            </div>

            <div className="region-list">
              {REGIONS.map((r) => (
                <div key={r.region} className="region-item">
                  <div className="region-meta">
                    <span className="region-name">{r.region}</span>
                    <span className="region-count">{r.percentage}% ({r.count})</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-bar" style={{ width: `${r.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Network Quality Diagnostics Grid */}
        <div className="sla-grid">
          <div className="sla-card">
            <span className="sla-label">Average Post-Dial Delay (PDD)</span>
            <div className="sla-num">68ms</div>
            <span className="sla-desc">Ultra-low latency SS7 signaling</span>
          </div>

          <div className="sla-card">
            <span className="sla-label">True Handset DLR Ack</span>
            <div className="sla-num text-green">99.4%</div>
            <span className="sla-desc">Confirmed handset delivery receipts</span>
          </div>

          <div className="sla-card">
            <span className="sla-label">Mean Opinion Score (Voice MOS)</span>
            <div className="sla-num text-blue">4.62 / 5.0</div>
            <span className="sla-desc">Pristine carrier audio clarity</span>
          </div>

          <div className="sla-card">
            <span className="sla-label">Global Backbone Uptime SLA</span>
            <div className="sla-num text-orange">99.99%</div>
            <span className="sla-desc">Equinix & Singapore redundant rings</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .stat-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }
        .stat-val {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0.25rem 0;
        }
        .stat-val.text-orange {
          color: var(--admin-accent);
        }
        .stat-val.text-blue {
          color: #38bdf8;
        }
        .stat-val.text-green {
          color: #10b981;
        }
        .stat-sub {
          font-size: 0.7rem;
          color: var(--admin-text-dim);
        }
        .dual-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .dual-grid {
            grid-template-columns: 1.3fr 1fr;
          }
        }
        .chart-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .card-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0;
        }
        .card-sub {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin: 2px 0 0 0;
        }
        .legend {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--admin-text-secondary);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot.orange {
          background: var(--admin-accent);
        }
        .dot.blue {
          background: #38bdf8;
        }
        .bars-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 180px;
          padding-top: 1rem;
          border-bottom: 1px solid var(--admin-border);
        }
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          height: 100%;
          flex: 1;
        }
        .bar-column {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 100%;
          width: 36px;
          justify-content: center;
        }
        .bar-fill {
          width: 14px;
          border-radius: 4px 4px 0 0;
          transition: height 0.4s ease;
        }
        .bar-fill.orange-bar {
          background: var(--admin-accent);
        }
        .bar-fill.blue-bar {
          background: #38bdf8;
        }
        .bar-month {
          font-size: 0.725rem;
          color: var(--admin-text-dim);
          font-weight: 600;
        }
        .region-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .region-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .region-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.775rem;
        }
        .region-name {
          color: var(--admin-text);
          font-weight: 600;
        }
        .region-count {
          color: var(--admin-text-muted);
          font-family: monospace;
        }
        .prog-track {
          height: 6px;
          background: var(--admin-border);
          border-radius: 999px;
          overflow: hidden;
        }
        .prog-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--admin-accent), #f59e0b);
          border-radius: 999px;
        }
        .sla-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .sla-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .sla-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .sla-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sla-label {
          font-size: 0.725rem;
          color: var(--admin-text-dim);
          font-weight: 700;
          text-transform: uppercase;
        }
        .sla-num {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--admin-text);
        }
        .sla-num.text-green {
          color: #10b981;
        }
        .sla-num.text-blue {
          color: #38bdf8;
        }
        .sla-num.text-orange {
          color: var(--admin-accent);
        }
        .sla-desc {
          font-size: 0.7rem;
          color: var(--admin-text-muted);
        }
      `}</style>
    </>
  );
}
