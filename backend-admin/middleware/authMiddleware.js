/**
 * Authentication & Role-Based Access Control (RBAC) Middleware
 * Validates JWT session tokens and enforces operator role permissions.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kimoksha_telecom_jwt_super_secret_key_2026';

const authMiddleware = {
  // Verify valid operator session
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] || req.cookies?.admin_session;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Session missing' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired token' });
    }
  },

  // Role guard: restrict routes to specific roles (e.g. ['super_admin', 'noc_engineer'])
  requireRole: (allowedRoles = []) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Insufficient operator privileges'
        });
      }
      next();
    };
  }
};

module.exports = authMiddleware;
