const BASE_URL = 'http://192.168.68.109:3000/api';
const api = {
  // ─── Register ──────────────────────────────────────────────────────────────
  register: async (username, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },

  // ─── Login ─────────────────────────────────────────────────────────────────
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // ─── Forgot Password ───────────────────────────────────────────────────────
  forgotPassword: async (email) => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // ─── Change Password ───────────────────────────────────────────────────────
  changePassword: async (email, newPassword) => {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    return res.json();
  },
};

export default api;