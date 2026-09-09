const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretshowlix_2026_key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jeganbhudeva23@gmail.com';

// ─── Helper: timing-safe string comparison ────────────────────────────────────
// Prevents timing attacks when comparing passwords
function safeCompare(a, b) {
    try {
        const bufA = Buffer.from(String(a));
        const bufB = Buffer.from(String(b));
        // Lengths must match for timingSafeEqual; return false early if not
        if (bufA.length !== bufB.length) {
            // Still run the comparison on dummy data to avoid length-based timing leaks
            crypto.timingSafeEqual(Buffer.alloc(bufA.length), Buffer.alloc(bufA.length));
            return false;
        }
        return crypto.timingSafeEqual(bufA, bufB);
    } catch {
        return false;
    }
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
// POST /api/auth/admin-login
// Verifies admin email + password against environment variables only.
// ADMIN_PASSWORD is NEVER sent to the client or stored in the database.
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs are present
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Ensure ADMIN_PASSWORD is actually configured
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword || adminPassword === 'CHANGE_ME_BEFORE_RUNNING') {
            console.error('❌ ADMIN_PASSWORD is not set in .env!');
            return res.status(503).json({ error: 'Authentication service is not configured. Contact administrator.' });
        }

        // 1. Check email matches admin email (case-insensitive safe compare)
        const emailMatch = safeCompare(email.toLowerCase().trim(), ADMIN_EMAIL.toLowerCase());

        // 2. Check password (timing-safe compare against env var)
        const passwordMatch = safeCompare(password, adminPassword);

        // Both must pass — do NOT reveal which one failed (prevents enumeration)
        if (!emailMatch || !passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials. Access denied.' });
        }

        // Issue a signed JWT — role and email are embedded; no DB record needed
        const token = jwt.sign(
            { role: 'admin', email: ADMIN_EMAIL },
            JWT_SECRET,
            { expiresIn: '8h' }  // 8-hour session for admin work
        );

        return res.json({
            token,
            role: 'admin',
            email: ADMIN_EMAIL,
            message: 'Login successful'
        });

    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ─── Regular User Signup ──────────────────────────────────────────────────────
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Block admin email from signing up as a regular user
        if (email && email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
            return res.status(403).json({ error: 'This email cannot be used for registration.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role: 'user' });
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Regular User Login ───────────────────────────────────────────────────────
// POST /api/auth/login  (kept for regular user flow — not used by admin)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Block admin from logging in via the regular login route
        if (email && email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
            return res.status(403).json({ error: 'Please use the admin login page.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, userId: user._id, role: user.role, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
