import { chromium } from 'playwright';

const baseUrl = 'http://localhost:3099';
const outDir = '/Users/pavanjillella/Downloads/portfolio/docs/screenshots';

(async () => {
  const browser = await chromium.launch();

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });

  // Homepage hero
  const p1 = await ctx.newPage();
  await p1.goto(baseUrl, { waitUntil: 'load', timeout: 15000 });
  await p1.waitForTimeout(3000);
  await p1.screenshot({ path: `${outDir}/homepage-hero.png` });

  // Scroll to bento cards
  await p1.evaluate(() => window.scrollBy(0, 700));
  await p1.waitForTimeout(1500);
  await p1.screenshot({ path: `${outDir}/homepage-bento.png` });

  // Full page
  await p1.screenshot({ path: `${outDir}/homepage-full.png`, fullPage: true });
  await p1.close();

  // About page
  const p2 = await ctx.newPage();
  await p2.goto(`${baseUrl}/about`, { waitUntil: 'load', timeout: 15000 });
  await p2.waitForTimeout(3000);
  await p2.screenshot({ path: `${outDir}/about.png` });
  await p2.close();

  // Projects page
  const p3 = await ctx.newPage();
  await p3.goto(`${baseUrl}/projects`, { waitUntil: 'load', timeout: 15000 });
  await p3.waitForTimeout(3000);
  await p3.screenshot({ path: `${outDir}/projects.png` });
  await p3.close();

  // Mobile
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: 'dark',
  });
  const mp = await mobile.newPage();
  await mp.goto(baseUrl, { waitUntil: 'load', timeout: 15000 });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: `${outDir}/mobile-home.png` });
  await mp.close();

  await browser.close();
  console.log('Done! Screenshots saved.');
})();
