const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();

  await page.goto('https://infosys424project.web.app/');


  await page.waitForSelector('nav');


  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav a'));
    const rosterLink = links.find(link => link.textContent.trim() === 'Roster');
    if (rosterLink) rosterLink.click();
  });

  
  await page.waitForSelector('input[placeholder="Search by name..."]');

  
  await page.type('input[placeholder="Search by name..."]', 'Andi');

 
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const searchButton = buttons.find(button => button.textContent.trim() === 'Search');
    if (searchButton) searchButton.click();
  });

  await new Promise(resolve => setTimeout(resolve, 2000));
 

  
  await page.screenshot({ path: 'roster-search.png' });

  console.log('✅ Search complete. Screenshot saved as "roster-search.png".');

  await browser.close();
})();
