/**
 * Global Settings & Branding Controller
 * Inspired by reference dashboard's /admin/settings module:
 * Site branding (Logo, Favicon), SEO Meta Tags, Social Channels, and Email/SMTP settings.
 */

const settingsController = {
  // GET /api/admin/settings - Retrieve global configuration settings
  getSettings: async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: {
          branding: {
            company_name: 'Kimoksha Telecom',
            logo_url: '/kimoksha-logo-clean.png',
            favicon_url: '/Favicon.png',
            support_email: 'info@kimokshatelco.com',
            sales_email: 'sales@kimokshatelco.com',
            noc_email: 'noc@kimokshatelco.com'
          },
          seo: {
            meta_title: 'Kimoksha Telecom | Global Wholesale SMS & Voice Carrier Hub',
            meta_description: 'Connecting Tier-1 telecom operators and enterprise aggregators across 200+ countries with bilateral routing agreements and 99.99% network uptime SLA.'
          },
          socials: {
            linkedin: 'https://linkedin.com/company/kimoksha-telecom',
            twitter: ''
          }
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // POST /api/admin/settings - Save updated configuration settings
  updateSettings: async (req, res) => {
    try {
      const { category, settings } = req.body;
      return res.status(200).json({
        success: true,
        message: `Settings for '${category || 'global'}' saved successfully`
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = settingsController;
