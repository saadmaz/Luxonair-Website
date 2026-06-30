import { request } from '@playwright/test';

const ctx = await request.newContext({ baseURL: 'https://luxeonair.co.uk' });

console.log('=== Testing live site ===\n');

const r1 = await ctx.post('/api/auth/login', {
  data: { username: 'super_admin', password: 'admin123' },
  headers: { 'Content-Type': 'application/json' },
});
console.log('POST /api/auth/login status:', r1.status());
console.log('body:', (await r1.text()).slice(0, 300));

const r2 = await ctx.get('/api/auth/me');
console.log('\nGET /api/auth/me status:', r2.status());
console.log('body:', (await r2.text()).slice(0, 200));

await ctx.dispose();
