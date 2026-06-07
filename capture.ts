import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  // Take screenshot in light mode (default should be dark mode, let's toggle it)
  // We can evaluate JS to click the toggle button
  await page.evaluate(() => {
    const toggleBtn = document.querySelector('button[aria-label="Toggle theme"]');
    if (toggleBtn) {
      (toggleBtn as HTMLButtonElement).click();
    }
  });
  
  // Wait a bit for transitions
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: '/Users/istiakahmmedbishal/.gemini/antigravity-ide/brain/caaa0182-5bfc-4105-a3b1-0e355a64a707/.tempmediaStorage/screenshot_light.png', fullPage: true });
  
  await browser.close();
})();
