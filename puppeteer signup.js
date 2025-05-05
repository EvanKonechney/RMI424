const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("https://infosys424project.firebaseapp.com", {
    waitUntil: "networkidle0",
  });

  // Optional: take a screenshot to check layout
  await page.screenshot({ path: "initial-load.png" });

  // Manually reveal join section if nav click doesn't work
  await page.evaluate(() => {
    document.querySelector("#homepage").classList.add("is-hidden");
    document.querySelector("#joinpage").classList.remove("is-hidden");
  });

  await page.waitForSelector("#firstName", { visible: true });

  // Fill the form
  await page.type("#firstName", "Bucky");
  await page.type("#lastName", "Badger");
  await page.type("#joinEmail", "bucky@wisc.edu");
  await page.type("#countryCode", "+1");
  await page.type("#phoneNumber", "1234567890");
  await page.type("#joinPassword", "SecurePassword123");
  await page.select("#yearSelect", "Sophomore");
  await page.type("#majorInput", "Risk Management");

  // Submit
  await page.click("button[type='submit']");
  await page.waitForSelector("#thank-you", { visible: true });

  console.log("✅ Form submitted.");
  await browser.close();
}

go();
