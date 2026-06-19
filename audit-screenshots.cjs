// Dark/light mode screenshot audit script
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const OUT  = path.join(__dirname, 'audit-shots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const PAGES = [
  { name: 'home',                  url: '/' },
  { name: 'about',                 url: '/about' },
  { name: 'contact',               url: '/contact' },
  { name: 'quote',                 url: '/quote' },
  { name: 'destinations',          url: '/destinations' },
  { name: 'destination-detail',    url: '/destinations/maldives-private-villa' },
  { name: 'deals',                 url: '/deals' },
  { name: 'flights',               url: '/flights' },
  { name: 'holidays',              url: '/holidays' },
  { name: 'holiday-types',         url: '/holiday-types' },
  { name: 'blog',                  url: '/blog' },
  { name: 'blog-post',             url: '/blog/best-time-to-visit-maldives' },
  { name: 'reviews',               url: '/reviews' },
  { name: 'faq',                   url: '/faq' },
];

async function shot(page, name, mode) {
  const file = path.join(OUT, `${name}-${mode}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  [${mode}] ${name} → ${file}`);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  for (const { name, url } of PAGES) {
    console.log(`\nAuditing: ${name} (${url})`);

    // ── LIGHT MODE ──
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    // Ensure light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.waitForTimeout(200);
    await shot(page, name, 'light');

    // ── DARK MODE ──
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(200);
    await shot(page, name, 'dark');
  }

  // Extra: hero section close-up in dark mode (above-fold only)
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, 'home-hero-dark-crop.png'), clip: { x: 0, y: 0, width: 1280, height: 700 } });
  console.log('\n  [dark] home-hero-dark-crop (above fold)');

  // Extra: hero section close-up in light mode
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, 'home-hero-light-crop.png'), clip: { x: 0, y: 0, width: 1280, height: 700 } });
  console.log('  [light] home-hero-light-crop (above fold)');

  await browser.close();
  console.log('\nDone. Screenshots in:', OUT);
})();
