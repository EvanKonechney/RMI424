const puppeteer = require("puppeteer");

async function searchRoster() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto("https://infosys424project.firebaseapp.com", {
    waitUntil: "networkidle0",
  });

  // Reveal the roster section
  await page.evaluate(() => {
    document.querySelector("#homepage").classList.add("is-hidden");
    document.querySelector("#rosterpage").classList.remove("is-hidden");
  });

  await page.waitForSelector("#rosterSearch", { visible: true });

  // Type "Ben" in the search box and click Search
  await page.type("#rosterSearch", "Ben");
  await page.click("#rosterSearchBtn");

  // Wait for results to load
  await page.waitForSelector(".member-roster .column", { visible: true });

  // Extract and print first result
  const firstName = await page.$eval(".member-roster .column", (el) =>
    el.textContent.trim()
  );
  console.log("First matching name in roster:", firstName);

  await browser.close();
}

searchRoster();
