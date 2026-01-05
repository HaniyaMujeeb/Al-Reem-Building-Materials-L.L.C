export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') return null; // ✅ check type

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  let base64 = parts[1];
  try {
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return JSON.parse(atob(base64));
  } catch (err) {
    console.error("Failed to decode token:", err);
    localStorage.removeItem("adminToken");
    return null;
  }
};
