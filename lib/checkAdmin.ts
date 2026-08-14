// lib/checkAdmin.ts
export async function checkAndSetAdmin(accessToken: string): Promise<boolean> {
  const res = await fetch('/api/admin-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: accessToken }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  localStorage.setItem('isAdmin', 'true');
  localStorage.setItem('adminToken', data.token);
  return true;
}