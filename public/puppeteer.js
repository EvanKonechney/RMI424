const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  try {
    // Go to the page with the join form
    const page = await browser.newPage();
    await page.goto("https://infosys424project.firebaseapp.com");

    // Fill out the form fields
    await page.type("#firstName", "Bucky");
    await page.type("#lastName", "Badger");
    await page.type("#joinEmail", "bucky@wisc.edu");
    await page.type("#countryCode", "+1");
    await page.type("#phoneNumber", "1234567890");
    await page.type("#joinPassword", "SecurePassword123");
    await page.select("#yearSelect", "Sophomore"); // Select 'Sophomore' from the dropdown
    await page.type("#majorInput", "Risk Management");

    // Submit the form
    await page.click("button[type='submit']");

    // Wait for the thank you message to appear
    await page.waitForSelector("#thank-you", { visible: true });

    console.log("Successfully submitted the form!");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

go();

const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  try {
    // Go to the page containing the roster
    const page = await browser.newPage();
    await page.goto("https://infosys424project.firebaseapp.com");

    // Wait for the roster section to load
    await page.waitForSelector("#rosterpage");

    // Type into the search input field to search for a name
    await page.type("#rosterSearch", "Bucky Badger");

    // Click the search button to trigger the search
    await page.click("#rosterSearchBtn");

    // Wait for the results to appear (adjust the selector based on the actual result structure)
    await page.waitForSelector(".member-roster");

    // Log the first member's name from the roster (just an example)
    const memberName = await page.$eval(".member-roster .column", (el) =>
      el.textContent.trim()
    );
    console.log("First member in the roster:", memberName);

    // Reset the search form by clicking the reset button
    await page.click("#rosterResetBtn");

    // Wait for the reset action to complete (optional: adjust based on reset behavior)
    await page.waitForSelector("#rosterSearch", { visible: true });

    console.log("Search reset successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

go();
