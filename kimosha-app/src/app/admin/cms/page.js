'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Layers,
  Activity,
  Globe,
  Server,
  Sliders,
  Award,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Clock,
  PhoneCall,
  Mail,
  Zap,
} from 'lucide-react';

export default function DynamicCmsPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // CMS Content State
  const [cmsData, setCmsData] = useState({
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
      partners: [],
    },
    testimonials: {
      items: [],
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
  });

  // Network PoPs State
  const [pops, setPops] = useState([]);
  const [popSaving, setPopSaving] = useState(null);

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      const [cmsRes, popsRes] = await Promise.all([
        fetch('/api/admin/cms'),
        fetch('/api/admin/cms/network-pops'),
      ]);

      const cmsJson = await cmsRes.json();
      const popsJson = await popsRes.json();

      if (cmsJson.success && cmsJson.content) {
        setCmsData({
          hero_counters: cmsJson.content.hero_counters?.payload || cmsData.hero_counters,
          services_specs: cmsJson.content.services_specs?.payload || cmsData.services_specs,
          carrier_marquee: cmsJson.content.carrier_marquee?.payload || cmsData.carrier_marquee,
          testimonials: cmsJson.content.testimonials?.payload || cmsData.testimonials,
          legal_escalation: cmsJson.content.legal_escalation?.payload || cmsData.legal_escalation,
        });
      }

      if (popsJson.success && popsJson.pops) {
        setPops(popsJson.pops);
      }
    } catch (e) {
      console.error('Failed to load CMS data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setSaveError(msg);
      setTimeout(() => setSaveError(''), 4000);
    } else {
      setSaveSuccess(msg);
      setTimeout(() => setSaveSuccess(''), 4000);
    }
  };

  const saveSection = async (sectionKey, payload) => {
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_key: sectionKey,
          payload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Changes to '${sectionKey}' published live.`);
      } else {
        showNotification(data.error || 'Failed to save section', true);
      }
    } catch (e) {
      showNotification('Network error while saving changes', true);
    } finally {
      setSaving(false);
    }
  };

  const updatePopNode = async (popCode, updates) => {
    setPopSaving(popCode);
    try {
      const res = await fetch('/api/admin/cms/network-pops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pop_code: popCode,
          ...updates,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPops((prev) =>
          prev.map((p) => (p.pop_code === popCode ? { ...p, ...updates } : p))
        );
        showNotification(`Node ${popCode} updated live.`);
      } else {
        showNotification(data.error || 'Failed to update PoP node', true);
      }
    } catch (e) {
      showNotification('Error updating PoP node', true);
    } finally {
      setPopSaving(null);
    }
  };

  // Marquee toggling
  const togglePartner = (id) => {
    const updated = cmsData.carrier_marquee.partners.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    const newMarquee = { ...cmsData.carrier_marquee, partners: updated };
    setCmsData((prev) => ({ ...prev, carrier_marquee: newMarquee }));
    saveSection('carrier_marquee', newMarquee);
  };

  // Add testimonial item
  const addTestimonial = () => {
    const newItem = {
      id: Date.now(),
      author: 'New Client VP',
      role: 'Director of Carrier Procurement',
      company: 'Tier-1 Partner',
      rating: 5,
      quote: 'Kimoksha delivers consistently low PDD and instant delivery receipts for high-volume routes.',
      date: 'September 2026',
      active: true,
    };
    const updatedItems = [newItem, ...(cmsData.testimonials.items || [])];
    const newTestimonials = { ...cmsData.testimonials, items: updatedItems };
    setCmsData((prev) => ({ ...prev, testimonials: newTestimonials }));
  };

  const removeTestimonial = (id) => {
    const updatedItems = (cmsData.testimonials.items || []).filter((i) => i.id !== id);
    const newTestimonials = { ...cmsData.testimonials, items: updatedItems };
    setCmsData((prev) => ({ ...prev, testimonials: newTestimonials }));
    saveSection('testimonials', newTestimonials);
  };

  return (
    <>
      <AdminHeader
        title="Dynamic Site CMS & Content Operations"
        subtitle="Live visual content management: Hero metric ribbons, Equinix PoP network nodes, carrier marquee, and NOC contacts."
      />
      <div className="cms-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="title-row">
            <h1 className="page-title">Dynamic Site CMS</h1>
            <span className="live-badge">
              <Zap size={12} />
              SYNCED TO PUBLIC FRONTEND
            </span>
          </div>
          <p className="page-subtitle">
            Direct visual content management for Kimoksha Telecom. Changes take effect on the live website immediately without redeploying code.
          </p>
        </div>

        <div className="header-actions">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <ExternalLink size={15} />
            Preview Live Site
          </a>
          <button onClick={fetchCmsData} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {saveSuccess && (
        <div className="alert-toast success">
          <CheckCircle2 size={18} />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="alert-toast error">
          <AlertCircle size={18} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="cms-tabs">
        <button
          className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          <Activity size={16} />
          Hero Metrics & Numbers
        </button>
        <button
          className={`tab-btn ${activeTab === 'network' ? 'active' : ''}`}
          onClick={() => setActiveTab('network')}
        >
          <Globe size={16} />
          Network PoPs Controller ({pops.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          <Sliders size={16} />
          Technical SLA Specs
        </button>
        <button
          className={`tab-btn ${activeTab === 'marquee' ? 'active' : ''}`}
          onClick={() => setActiveTab('marquee')}
        >
          <Server size={16} />
          Carrier Partner Marquee
        </button>
        <button
          className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          <Award size={16} />
          Client Testimonials
        </button>
        <button
          className={`tab-btn ${activeTab === 'escalation' ? 'active' : ''}`}
          onClick={() => setActiveTab('escalation')}
        >
          <ShieldAlert size={16} />
          NOC Escalation Directory
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={28} className="spin text-orange" />
          <p>Syncing CMS state from Supabase data engine...</p>
        </div>
      ) : (
        <div className="tab-content">
          {/* TAB 1: HERO METRICS */}
          {activeTab === 'hero' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Hero Section Metric Ribbons</h2>
                  <p className="panel-desc">
                    These figures are prominently featured on the Homepage hero ribbon to demonstrate carrier scale.
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => saveSection('hero_counters', cmsData.hero_counters)}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Publishing...' : 'Save & Publish Live'}
                </button>
              </div>

              <div className="metrics-grid">
                <div className="metric-input-card">
                  <label>Connected Countries</label>
                  <input
                    type="text"
                    value={cmsData.hero_counters?.connected_countries || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero_counters: {
                          ...cmsData.hero_counters,
                          connected_countries: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 200+"
                  />
                  <span className="field-hint">Visible in first hero stat block</span>
                </div>

                <div className="metric-input-card">
                  <label>Direct MNO Binds</label>
                  <input
                    type="text"
                    value={cmsData.hero_counters?.direct_mno_binds || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero_counters: {
                          ...cmsData.hero_counters,
                          direct_mno_binds: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 500+"
                  />
                  <span className="field-hint">Total wholesale operator interconnects</span>
                </div>

                <div className="metric-input-card">
                  <label>Network Uptime SLA</label>
                  <input
                    type="text"
                    value={cmsData.hero_counters?.network_uptime_sla || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero_counters: {
                          ...cmsData.hero_counters,
                          network_uptime_sla: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 99.99%"
                  />
                  <span className="field-hint">Platform operational availability commitment</span>
                </div>

                <div className="metric-input-card">
                  <label>Daily SMS Volume</label>
                  <input
                    type="text"
                    value={cmsData.hero_counters?.daily_sms_volume || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        hero_counters: {
                          ...cmsData.hero_counters,
                          daily_sms_volume: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 150M+"
                  />
                  <span className="field-hint">Aggregate daily transactional message throughput</span>
                </div>
              </div>

              {/* Real-time Preview */}
              <div className="live-preview-box">
                <div className="preview-label">LIVE HERO RIBBON PREVIEW</div>
                <div className="preview-stats-row">
                  <div className="preview-stat">
                    <div className="stat-val">{cmsData.hero_counters?.connected_countries}</div>
                    <div className="stat-lbl">Connected Countries</div>
                  </div>
                  <div className="preview-stat">
                    <div className="stat-val">{cmsData.hero_counters?.direct_mno_binds}</div>
                    <div className="stat-lbl">Direct MNO Binds</div>
                  </div>
                  <div className="preview-stat">
                    <div className="stat-val text-green">{cmsData.hero_counters?.network_uptime_sla}</div>
                    <div className="stat-lbl">Network Uptime SLA</div>
                  </div>
                  <div className="preview-stat">
                    <div className="stat-val text-orange">{cmsData.hero_counters?.daily_sms_volume}</div>
                    <div className="stat-lbl">Daily SMS Volume</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NETWORK POPS CONTROLLER */}
          {activeTab === 'network' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Carrier Network Map Nodes (PoPs)</h2>
                  <p className="panel-desc">
                    Control the operational status, latency metrics, and protocols shown on the homepage CarrierNetworkMap.
                  </p>
                </div>
              </div>

              <div className="pops-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>PoP Code</th>
                      <th>Facility & Location</th>
                      <th>Status State</th>
                      <th>Observed Latency</th>
                      <th>Supported Interconnects</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pops.map((pop) => (
                      <tr key={pop.pop_code}>
                        <td>
                          <span className="pop-code-badge">{pop.pop_code}</span>
                        </td>
                        <td>
                          <div className="pop-name">{pop.name}</div>
                          <div className="pop-geo">
                            {pop.city}, {pop.country}
                          </div>
                        </td>
                        <td>
                          <select
                            className={`status-select ${pop.status.toLowerCase()}`}
                            value={pop.status}
                            onChange={(e) =>
                              updatePopNode(pop.pop_code, { status: e.target.value })
                            }
                            disabled={popSaving === pop.pop_code}
                          >
                            <option value="ONLINE">🟢 ONLINE</option>
                            <option value="DEGRADED">🟡 DEGRADED</option>
                            <option value="MAINTENANCE">🔴 MAINTENANCE</option>
                          </select>
                        </td>
                        <td>
                          <div className="latency-edit-row">
                            <input
                              type="number"
                              className="latency-input"
                              value={pop.latency_ms}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPops((prev) =>
                                  prev.map((p) =>
                                    p.pop_code === pop.pop_code
                                      ? { ...p, latency_ms: Number(val) }
                                      : p
                                  )
                                );
                              }}
                              onBlur={(e) =>
                                updatePopNode(pop.pop_code, {
                                  latency_ms: Number(e.target.value),
                                })
                              }
                            />
                            <span className="unit">ms</span>
                          </div>
                        </td>
                        <td>
                          <span className="protocol-tags">{pop.supported_protocols}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-sm-save"
                            onClick={() =>
                              updatePopNode(pop.pop_code, {
                                status: pop.status,
                                latency_ms: pop.latency_ms,
                              })
                            }
                            disabled={popSaving === pop.pop_code}
                          >
                            {popSaving === pop.pop_code ? 'Saving...' : 'Update'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL SLA SPECS */}
          {activeTab === 'specs' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Technical Specifications & SLA Commitments</h2>
                  <p className="panel-desc">
                    Wholesale carrier engineering parameters shown in service offerings and technical documentation.
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => saveSection('services_specs', cmsData.services_specs)}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Publishing...' : 'Save & Publish Live'}
                </button>
              </div>

              <div className="specs-form-grid">
                <div className="form-group">
                  <label>Max SMPP Throughput (TPS)</label>
                  <input
                    type="text"
                    value={cmsData.services_specs?.smpp_tps_max || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        services_specs: {
                          ...cmsData.services_specs,
                          smpp_tps_max: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">SMPP 3.4 Transceiver bound rate</span>
                </div>

                <div className="form-group">
                  <label>Voice Supported Codecs</label>
                  <input
                    type="text"
                    value={cmsData.services_specs?.voice_codecs || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        services_specs: {
                          ...cmsData.services_specs,
                          voice_codecs: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Allowed SIP voice transcoding profiles</span>
                </div>

                <div className="form-group">
                  <label>Post-Dial Delay SLA</label>
                  <input
                    type="text"
                    value={cmsData.services_specs?.post_dial_delay_max || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        services_specs: {
                          ...cmsData.services_specs,
                          post_dial_delay_max: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Target call setup duration before ringback</span>
                </div>

                <div className="form-group">
                  <label>SS7 Jitter Tolerance</label>
                  <input
                    type="text"
                    value={cmsData.services_specs?.ss7_jitter_sla || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        services_specs: {
                          ...cmsData.services_specs,
                          ss7_jitter_sla: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Packet delay variance threshold</span>
                </div>

                <div className="form-group full-width">
                  <label>Direct SS7 Interconnect Call Completion</label>
                  <input
                    type="text"
                    value={cmsData.services_specs?.direct_ss7_interconnects || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        services_specs: {
                          ...cmsData.services_specs,
                          direct_ss7_interconnects: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Answer-Seizure Ratio (ASR) target for direct CLI routes</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CARRIER MARQUEE */}
          {activeTab === 'marquee' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Carrier Partner Marquee</h2>
                  <p className="panel-desc">
                    Toggle which Tier-1 telecom partners appear in the rolling marquee across the homepage.
                  </p>
                </div>
              </div>

              <div className="partner-grid">
                {cmsData.carrier_marquee?.partners?.map((partner) => (
                  <div
                    key={partner.id}
                    className={`partner-card ${partner.active ? 'active' : 'inactive'}`}
                  >
                    <div className="partner-top">
                      <span className="tier-tag">{partner.tier}</span>
                      <span className="region-tag">{partner.region}</span>
                    </div>
                    <div className="partner-name">{partner.name}</div>
                    <div className="partner-toggle-row">
                      <span className="status-label">
                        {partner.active ? 'Visible on Marquee' : 'Hidden'}
                      </span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={partner.active}
                          onChange={() => togglePartner(partner.id)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">Enterprise Testimonials & Case Reviews</h2>
                  <p className="panel-desc">
                    Wholesale client endorsements and partner success reviews.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-secondary" onClick={addTestimonial}>
                    <Plus size={16} />
                    Add Testimonial
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => saveSection('testimonials', cmsData.testimonials)}
                    disabled={saving}
                  >
                    <Save size={16} />
                    {saving ? 'Publishing...' : 'Save & Publish Live'}
                  </button>
                </div>
              </div>

              <div className="testimonials-list">
                {cmsData.testimonials?.items?.map((item) => (
                  <div key={item.id} className="testimonial-card">
                    <div className="testimonial-header">
                      <div>
                        <input
                          type="text"
                          className="author-input"
                          value={item.author}
                          onChange={(e) => {
                            const updated = cmsData.testimonials.items.map((i) =>
                              i.id === item.id ? { ...i, author: e.target.value } : i
                            );
                            setCmsData({
                              ...cmsData,
                              testimonials: { ...cmsData.testimonials, items: updated },
                            });
                          }}
                        />
                        <div className="meta-inputs">
                          <input
                            type="text"
                            placeholder="Role / Title"
                            value={item.role}
                            onChange={(e) => {
                              const updated = cmsData.testimonials.items.map((i) =>
                                i.id === item.id ? { ...i, role: e.target.value } : i
                              );
                              setCmsData({
                                ...cmsData,
                                testimonials: { ...cmsData.testimonials, items: updated },
                              });
                            }}
                          />
                          <span>at</span>
                          <input
                            type="text"
                            placeholder="Company"
                            value={item.company}
                            onChange={(e) => {
                              const updated = cmsData.testimonials.items.map((i) =>
                                i.id === item.id ? { ...i, company: e.target.value } : i
                              );
                              setCmsData({
                                ...cmsData,
                                testimonials: { ...cmsData.testimonials, items: updated },
                              });
                            }}
                          />
                        </div>
                      </div>
                      <button
                        className="btn-delete"
                        onClick={() => removeTestimonial(item.id)}
                        title="Delete Testimonial"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      className="quote-textarea"
                      value={item.quote}
                      onChange={(e) => {
                        const updated = cmsData.testimonials.items.map((i) =>
                          i.id === item.id ? { ...i, quote: e.target.value } : i
                        );
                        setCmsData({
                          ...cmsData,
                          testimonials: { ...cmsData.testimonials, items: updated },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NOC ESCALATION DIRECTORY */}
          {activeTab === 'escalation' && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">24/7 NOC Escalation & Shift Contacts</h2>
                  <p className="panel-desc">
                    Emergency contact information, shift escalation lead, and target response SLA timeframes.
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => saveSection('legal_escalation', cmsData.legal_escalation)}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? 'Publishing...' : 'Save & Publish Live'}
                </button>
              </div>

              <div className="escalation-grid">
                <div className="form-group">
                  <label>
                    <PhoneCall size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    24/7 Emergency NOC Hotline
                  </label>
                  <input
                    type="text"
                    value={cmsData.legal_escalation?.emergency_noc_phone || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        legal_escalation: {
                          ...cmsData.legal_escalation,
                          emergency_noc_phone: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Hotline for carrier outages and SS7 rerouting</span>
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Emergency NOC Dispatch Email
                  </label>
                  <input
                    type="email"
                    value={cmsData.legal_escalation?.emergency_noc_email || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        legal_escalation: {
                          ...cmsData.legal_escalation,
                          emergency_noc_email: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Direct inbox monitored 24/7 by on-duty engineers</span>
                </div>

                <div className="form-group">
                  <label>
                    <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Tier-1 Support Response Target
                  </label>
                  <input
                    type="text"
                    value={cmsData.legal_escalation?.tier1_response_min || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        legal_escalation: {
                          ...cmsData.legal_escalation,
                          tier1_response_min: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Initial acknowledgement and ticket assignment SLA</span>
                </div>

                <div className="form-group">
                  <label>
                    <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Tier-2 Engineering Escalation SLA
                  </label>
                  <input
                    type="text"
                    value={cmsData.legal_escalation?.tier2_response_min || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        legal_escalation: {
                          ...cmsData.legal_escalation,
                          tier2_response_min: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Senior routing engineer incident engagement SLA</span>
                </div>

                <div className="form-group full-width">
                  <label>Current Escalation Lead</label>
                  <input
                    type="text"
                    value={cmsData.legal_escalation?.escalation_lead_name || ''}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        legal_escalation: {
                          ...cmsData.legal_escalation,
                          escalation_lead_name: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="field-hint">Chief engineer responsible for shift handover and major ticket resolution</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .cms-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .page-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }
        .page-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 0.25rem;
          max-width: 680px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          padding: 0.55rem 0.9rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f26522;
          border: 1px solid #f26522;
          color: #ffffff;
          padding: 0.55rem 1rem;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #d85416;
          box-shadow: 0 4px 12px rgba(242, 101, 34, 0.3);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .alert-toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .alert-toast.success {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }
        .alert-toast.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }
        .cms-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }
        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: #f1f5f9;
        }
        .tab-btn.active {
          color: #f26522;
          border-bottom-color: #f26522;
        }
        .loading-state {
          background: #0d1522;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #94a3b8;
        }
        .panel {
          background: #0d1522;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 1rem;
        }
        .panel-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .panel-desc {
          font-size: 0.825rem;
          color: #64748b;
          margin-top: 0.2rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .metric-input-card {
          background: #111a2c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .metric-input-card label {
          font-size: 0.775rem;
          font-weight: 700;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .metric-input-card input {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 0.6rem 0.8rem;
          outline: none;
        }
        .metric-input-card input:focus {
          border-color: #f26522;
        }
        .field-hint {
          font-size: 0.7rem;
          color: #64748b;
        }
        .live-preview-box {
          background: #080c14;
          border: 1px dashed rgba(242, 101, 34, 0.3);
          border-radius: 10px;
          padding: 1.25rem;
        }
        .preview-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #f26522;
          margin-bottom: 0.75rem;
        }
        .preview-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }
        .preview-stat {
          text-align: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .stat-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #f8fafc;
        }
        .stat-lbl {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.2rem;
        }
        .text-green {
          color: #4ade80 !important;
        }
        .text-orange {
          color: #f26522 !important;
        }

        /* PoPs Table */
        .pops-table-container {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .admin-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .pop-code-badge {
          background: rgba(242, 101, 34, 0.15);
          color: #f26522;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .pop-name {
          font-weight: 700;
          color: #f8fafc;
        }
        .pop-geo {
          font-size: 0.75rem;
          color: #64748b;
        }
        .status-select {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f8fafc;
          padding: 0.45rem 0.65rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          outline: none;
          cursor: pointer;
        }
        .status-select.online {
          color: #4ade80;
          border-color: rgba(74, 222, 128, 0.4);
        }
        .status-select.maintenance {
          color: #f87171;
          border-color: rgba(248, 113, 113, 0.4);
        }
        .status-select.degraded {
          color: #fbbf24;
          border-color: rgba(251, 191, 36, 0.4);
        }
        .latency-edit-row {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .latency-input {
          width: 60px;
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          color: #ffffff;
          padding: 0.35rem 0.5rem;
          font-weight: 700;
          text-align: right;
          outline: none;
        }
        .unit {
          color: #64748b;
          font-size: 0.8rem;
        }
        .protocol-tags {
          color: #94a3b8;
          font-size: 0.75rem;
        }
        .btn-sm-save {
          background: rgba(242, 101, 34, 0.15);
          border: 1px solid rgba(242, 101, 34, 0.4);
          color: #f26522;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-sm-save:hover {
          background: #f26522;
          color: #ffffff;
        }

        /* Specs Form */
        .specs-form-grid,
        .escalation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #cbd5e1;
        }
        .form-group input {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
          padding: 0.65rem 0.85rem;
          outline: none;
        }
        .form-group input:focus {
          border-color: #f26522;
        }

        /* Partner Marquee */
        .partner-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .partner-card {
          background: #111a2c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.2s;
        }
        .partner-card.inactive {
          opacity: 0.5;
        }
        .partner-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tier-tag {
          background: rgba(242, 101, 34, 0.15);
          color: #f26522;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .region-tag {
          color: #64748b;
          font-size: 11px;
        }
        .partner-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .partner-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 0.75rem;
        }
        .status-label {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Testimonials */
        .testimonials-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .testimonial-card {
          background: #111a2c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .testimonial-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .author-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          color: #f8fafc;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.2rem 0;
          outline: none;
        }
        .author-input:focus {
          border-color: #f26522;
        }
        .meta-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }
        .meta-inputs input {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: #94a3b8;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          outline: none;
        }
        .meta-inputs span {
          color: #64748b;
          font-size: 0.75rem;
        }
        .quote-textarea {
          background: #070b13;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #cbd5e1;
          font-size: 0.85rem;
          padding: 0.75rem;
          outline: none;
          resize: vertical;
          font-family: inherit;
        }
        .quote-textarea:focus {
          border-color: #f26522;
        }
        .btn-delete {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.4rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        /* Switch styling */
        .switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #334155;
          transition: 0.3s;
        }
        .slider:before {
          position: absolute;
          content: '';
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
        }
        input:checked + .slider {
          background-color: #f26522;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }
        .slider.round {
          border-radius: 20px;
        }
        .slider.round:before {
          border-radius: 50%;
        }

        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
    </>
  );
}
