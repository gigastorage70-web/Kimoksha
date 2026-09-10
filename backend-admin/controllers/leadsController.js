/**
 * Inbound Leads & Carrier Interconnect Controller
 * Handles lead triage, status lifecycle, filtering, CSV export, and internal notes.
 */

// Simulated database interface (ready to be bound to Prisma / PostgreSQL / SQLite)
const leadsController = {
  // GET /api/admin/leads - Fetch paginated leads with status & search filtering
  getLeads: async (req, res) => {
    try {
      const { status = 'ALL', search = '', page = 1, limit = 25 } = req.query;
      // In production: query database with where clauses
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { page: Number(page), limit: Number(limit), total: 0 }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/admin/leads/:id - Fetch single lead details with internal notes
  getLeadById: async (req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).json({
        success: true,
        data: { id, notes: [] }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // PATCH /api/admin/leads/:id/status - Update lead lifecycle stage
  updateLeadStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowedStatuses = [
        'NEW',
        'CONTACTED',
        'RATE_CARD_DISPATCHED',
        'TEST_BIND_PROVISIONED',
        'CONVERTED',
        'ARCHIVED'
      ];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status code' });
      }
      return res.status(200).json({ success: true, message: `Lead status updated to ${status}` });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // POST /api/admin/leads/:id/notes - Add internal team discussion note
  addInternalNote: async (req, res) => {
    try {
      const { id } = req.params;
      const { note_text } = req.body;
      if (!note_text) {
        return res.status(400).json({ success: false, error: 'Note text is required' });
      }
      return res.status(201).json({ success: true, message: 'Internal note added' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/admin/leads/export - One-click export to CSV / Excel
  exportLeadsCsv: async (req, res) => {
    try {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="kimoksha_leads_export.csv"');
      const csvHeader = 'ID,Full Name,Corporate Email,Subject,Message,Status,IP,Country,Date\n';
      return res.status(200).send(csvHeader);
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = leadsController;
