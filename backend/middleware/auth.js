const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretshowlix_2026_key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jeganbhudeva23@gmail.com';

/**
 * Auth middleware factory.
 *
 * @param {string[]} roles - Allowed roles, e.g. ['admin'] or ['user', 'admin'].
 *                           Pass an empty array to allow any authenticated user.
 *
 * Admin tokens are self-contained (role + email embedded in JWT).
 * Regular user tokens carry a userId and are validated against the DB.
 */
const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'No token, authorization denied.' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            // ── Admin token path ─────────────────────────────────────────────
            // Admin tokens carry { role: 'admin', email } — no DB lookup needed
            if (decoded.role === 'admin' && decoded.email === ADMIN_EMAIL) {
                req.user = { role: 'admin', email: ADMIN_EMAIL };

                // Check role restrictions if specified
                if (roles.length && !roles.includes('admin')) {
                    return res.status(403).json({ error: 'Access denied: Insufficient permissions.' });
                }
                return next();
            }

            // ── Regular user token path ──────────────────────────────────────
            // Regular user tokens carry { userId } — look up in DB
            if (decoded.userId) {
                const user = await User.findById(decoded.userId);
                if (!user) {
                    return res.status(401).json({ error: 'User not found.' });
                }

                // Block any regular user from having admin role via DB
                if (user.role === 'admin' || user.email === ADMIN_EMAIL) {
                    return res.status(403).json({ error: 'Access denied.' });
                }

                if (roles.length && !roles.includes(user.role)) {
                    return res.status(403).json({ error: 'Access denied: Insufficient permissions.' });
                }

                req.user = user;
                return next();
            }

            // Unknown token shape
            return res.status(401).json({ error: 'Token is not valid.' });

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Session expired. Please log in again.' });
            }
            return res.status(401).json({ error: 'Token is not valid.' });
        }
    };
};

module.exports = auth;
