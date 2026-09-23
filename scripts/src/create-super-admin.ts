export {};

const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceKey = process.env.DITHETO_ACTIVE_SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD;

if (!baseUrl || !serviceKey || !email || !password) {
  throw new Error(
    'Set SUPABASE_URL, DITHETO_ACTIVE_SUPABASE_SERVICE_ROLE_KEY, SUPER_ADMIN_EMAIL, and SUPER_ADMIN_PASSWORD.',
  );
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
};

const createResponse = await fetch(`${baseUrl}/auth/v1/admin/users`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ email, password, email_confirm: true }),
});
const createBody = (await createResponse.json()) as { id?: string; msg?: string; message?: string };

if (!createResponse.ok || !createBody.id) {
  throw new Error(createBody.msg ?? createBody.message ?? `Supabase Auth user creation failed (${createResponse.status}).`);
}

const userId = createBody.id;
const roleResponse = await fetch(`${baseUrl}/rest/v1/admin_users`, {
  method: 'POST',
  headers: { ...headers, Prefer: 'return=minimal' },
  body: JSON.stringify({ user_id: userId, email, role: 'super_admin' }),
});

if (!roleResponse.ok) {
  await fetch(`${baseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers,
  });
  const roleBody = (await roleResponse.json()) as { message?: string; error?: string };
  throw new Error(
    `${roleBody.message ?? roleBody.error ?? 'Super Admin role creation failed.'} Auth user was rolled back.`,
  );
}

console.log(JSON.stringify({ email, userId, role: 'super_admin' }));