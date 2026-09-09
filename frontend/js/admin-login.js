/**
 * admin-login.js
 * Dedicated script for the Admin Login page.
 * Handles form submission, loading state, show/hide password, inline error.
 * Does NOT expose ADMIN_PASSWORD — all verification is server-side.
 */

(function () {
    'use strict';

    const API_BASE = 'http://localhost:5000/api';
    const ADMIN_EMAIL_HINT = 'jeganbhudeva23@gmail.com';  // Only the authorized admin can log in

    document.addEventListener('DOMContentLoaded', () => {
        // ── If already logged in as admin, redirect straight to dashboard ─────
        const existingToken = localStorage.getItem('token');
        const existingRole  = localStorage.getItem('role');
        if (existingToken && existingRole === 'admin') {
            window.location.href = 'admin.html';
            return;
        }

        const form         = document.getElementById('adminLoginForm');
        const emailInput   = document.getElementById('adminEmail');
        const passwordInput= document.getElementById('adminPassword');
        const togglePwdBtn = document.getElementById('togglePassword');
        const loginBtn     = document.getElementById('loginBtn');
        const errorBox     = document.getElementById('loginError');
        const errorText    = document.getElementById('loginErrorText');
        const btnText      = document.getElementById('btnText');
        const btnSpinner   = document.getElementById('btnSpinner');

        // ── Show / Hide password toggle ───────────────────────────────────────
        if (togglePwdBtn) {
            togglePwdBtn.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                togglePwdBtn.innerHTML = isPassword
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
                togglePwdBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            });
        }

        // ── Clear error on input ──────────────────────────────────────────────
        [emailInput, passwordInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => hideError());
            }
        });

        // ── Form submit ───────────────────────────────────────────────────────
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                hideError();

                const email    = emailInput.value.trim();
                const password = passwordInput.value;

                // Basic client-side validation
                if (!email || !password) {
                    showError('Please enter both email and password.');
                    return;
                }

                if (!isValidEmail(email)) {
                    showError('Please enter a valid email address.');
                    return;
                }

                // Start loading state
                setLoading(true);

                try {
                    const res = await fetch(`${API_BASE}/auth/admin-login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        // Send credentials to server — verification happens server-side only
                        body: JSON.stringify({ email, password })
                    });

                    const data = await res.json();

                    if (res.ok && data.token && data.role === 'admin') {
                        // Store token and role (NOT the password)
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('role', data.role);
                        localStorage.setItem('email', data.email);

                        // Brief success flash before redirect
                        loginBtn.style.background = 'linear-gradient(135deg, #16a34a, #15803d)';
                        btnText.textContent = '✓ Authenticated';
                        setTimeout(() => {
                            window.location.href = 'admin.html';
                        }, 600);
                    } else {
                        // Server returned an error
                        showError(data.error || 'Invalid credentials. Access denied.');
                        shakeForm(form);
                    }

                } catch (err) {
                    console.error('Login request failed:', err);
                    showError('Cannot connect to the server. Please try again.');
                } finally {
                    setLoading(false);
                }
            });
        }

        // ── Helpers ───────────────────────────────────────────────────────────
        function setLoading(isLoading) {
            if (!loginBtn) return;
            loginBtn.disabled = isLoading;
            if (btnText)    btnText.textContent  = isLoading ? 'Authenticating…' : 'Login';
            if (btnSpinner) btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
        }

        function showError(message) {
            if (!errorBox || !errorText) return;
            errorText.textContent = message;
            errorBox.style.display = 'flex';
            errorBox.setAttribute('role', 'alert');
            // Scroll into view if needed
            errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function hideError() {
            if (!errorBox || !errorText) return;
            errorText.textContent = '';
            errorBox.style.display = 'none';
            errorBox.removeAttribute('role');
        }

        function shakeForm(el) {
            el.classList.add('shake-anim');
            setTimeout(() => el.classList.remove('shake-anim'), 600);
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    });
})();
