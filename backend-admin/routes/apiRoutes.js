/**
 * Central API Router for Kimoksha Telecom Backend & Admin Engine
 * Binds controllers to REST endpoints for both Admin operations and Frontend form submissions.
 */

const express = require('express');
const router = express.Router();

const leadsController = require('../controllers/leadsController');
const rateCardsController = require('../controllers/rateCardsController');
const contentController = require('../controllers/contentController');
const securityController = require('../controllers/securityController');
const settingsController = require('../controllers/settingsController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// -----------------------------------------------------------------------------
// PUBLIC TOUCHPOINTS (Interacts directly with Frontend Next.js components)
// -----------------------------------------------------------------------------
// Submission endpoint for "Lets Connect" Form (Home & Contact pages)
router.post('/public/inquiries', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject) {
      return res.status(400).json({ success: false, error: 'Name, email, and subject are required.' });
    }
    // Record lead to database
    return res.status(201).json({
      success: true,
      message: 'Inquiry received. A Kimoksha carrier representative will be in touch shortly.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Public Network PoPs endpoint for CarrierNetworkMap.jsx
router.get('/public/network-pops', contentController.getNetworkPops);

// -----------------------------------------------------------------------------
// PROTECTED ADMIN OPERATIONS (Requires valid Session & RBAC permissions)
// -----------------------------------------------------------------------------
// 1. Leads Management CRM
router.get('/admin/leads', verifyToken, leadsController.getLeads);
router.get('/admin/leads/export', verifyToken, leadsController.exportLeadsCsv);
router.get('/admin/leads/:id', verifyToken, leadsController.getLeadById);
router.patch('/admin/leads/:id/status', verifyToken, leadsController.updateLeadStatus);
router.post('/admin/leads/:id/notes', verifyToken, leadsController.addInternalNote);

// 2. Rate Decks Manager
router.get('/admin/rate-decks', verifyToken, rateCardsController.getRateDecks);
router.post('/admin/rate-decks/upload', verifyToken, requireRole(['super_admin', 'sales_billing']), rateCardsController.uploadRateDeck);
router.delete('/admin/rate-decks/:id', verifyToken, requireRole(['super_admin']), rateCardsController.deleteRateDeck);

// 3. Dynamic CMS & Network PoPs
router.get('/admin/content/:section', verifyToken, contentController.getSectionContent);
router.put('/admin/content/:section', verifyToken, requireRole(['super_admin']), contentController.updateSectionContent);
router.patch('/admin/network-pops/:code', verifyToken, requireRole(['super_admin', 'noc_engineer']), contentController.updatePopStatus);

// 4. Security & Audit Logs
router.get('/admin/security/logs', verifyToken, requireRole(['super_admin', 'noc_engineer']), securityController.getAuditLogs);
router.get('/admin/security/blocked-ips', verifyToken, requireRole(['super_admin', 'noc_engineer']), securityController.getBlockedIps);
router.post('/admin/security/blocked-ips', verifyToken, requireRole(['super_admin']), securityController.blockIp);
router.delete('/admin/security/blocked-ips/:id', verifyToken, requireRole(['super_admin']), securityController.unblockIp);

// 5. Global Settings & Branding
router.get('/admin/settings', verifyToken, settingsController.getSettings);
router.post('/admin/settings', verifyToken, requireRole(['super_admin']), settingsController.updateSettings);

module.exports = router;
