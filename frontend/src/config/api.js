// Konfigurasi API URL terpusat
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Jika di localhost, coba pakai VITE_API_URL (biasanya http://localhost:8000). Jika tidak, paksa ke production Railway.
const API_URL = isLocalhost 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000') 
  : 'https://ipb-help-center-v02-production.up.railway.app';

export default API_URL;
