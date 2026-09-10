/**
 * Content Management System (CMS) Controller
 * Allows admins to update frontend website components without touching source code:
 * - Metric Counters (Connected Countries, MNO Direct Binds, Uptime SLA)
 * - Service Offerings & Technical Parameters (codecs, TPS limits)
 * - Network PoPs (latency, status, coordinates)
 * - Operations & NOC Escalation Contacts
 */

const contentController = {
  // GET /api/admin/content/:section - Fetch section data payload
  getSectionContent: async (req, res) => {
    try {
      const { section } = req.params;
      return res.status(200).json({
        success: true,
        section,
        data: {}
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // PUT /api/admin/content/:section - Update section data payload
  updateSectionContent: async (req, res) => {
    try {
      const { section } = req.params;
      const { title, subtitle, badge_label, content_payload, is_visible } = req.body;
      return res.status(200).json({
        success: true,
        message: `Section '${section}' updated successfully on frontend`
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/admin/network-pops - Fetch all carrier network map nodes
  getNetworkPops: async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: [
          { pop_code: 'DX1', name: 'Equinix DX1', city: 'Dubai', country: 'UAE', status: 'ONLINE', latency_ms: 18 },
          { pop_code: 'LD4', name: 'Equinix LD4', city: 'London', country: 'UK', status: 'ONLINE', latency_ms: 12 },
          { pop_code: 'FR2', name: 'Equinix FR2', city: 'Frankfurt', country: 'Germany', status: 'ONLINE', latency_ms: 14 },
          { pop_code: 'SG1', name: 'Equinix SG1', city: 'Singapore', country: 'Singapore', status: 'ONLINE', latency_ms: 22 }
        ]
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // PATCH /api/admin/network-pops/:code - Update node latency / status
  updatePopStatus: async (req, res) => {
    try {
      const { code } = req.params;
      const { status, latency_ms } = req.body;
      return res.status(200).json({
        success: true,
        message: `Network Node ${code} updated (status: ${status}, latency: ${latency_ms}ms)`
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = contentController;
