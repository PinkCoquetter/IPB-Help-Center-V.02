// Konfigurasi API URL terpusat
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Jika di localhost, coba pakai VITE_API_URL (biasanya http://localhost:8000). Jika tidak, paksa ke production Railway.
const API_URL = isLocalhost 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000') 
  : 'https://ipb-help-center-v02-production.up.railway.app';

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  // Jangan set Content-Type jika body adalah FormData (agar browser auto set multipart/form-data boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  // Jika token expired (401), bisa ditambahkan logika auto-logout atau refresh token di sini
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isStaffLoggedIn');
    window.location.href = '/login';
  }

  return response;
};

export default API_URL;
