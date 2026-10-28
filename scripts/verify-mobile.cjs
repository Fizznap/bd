/* eslint-disable */
const puppeteer = require("puppeteer-core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--disable-gpu", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3459/", { waitUntil: "networkidle0", timeout: 60000 });
  await sleep(1600);
  await page.click(".fixed button");
  await sleep(2400);
  await page.evaluate(() => document.getElementById("moments").scrollIntoView());
  await sleep(2400);
  const buttons = await page.$$eval("#moments .grid button", (b) => b.length);
  await page.evaluate(() => {
    Array.from(document.querySelectorAll("#moments .grid button"))[2].click();
  });
  await sleep(2600);
  const dlg = await page.$eval("[role=dialog]", (el) => el.getAttribute("aria-label"));
  const playing = await page.evaluate(() => { const v = document.querySelector("video"); return v ? !v.paused : false; });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: process.env.TEMP + "\\opencode\\shots\\m16-lightbox.png" });
  await page.keyboard.press("Escape");
  await sleep(1200);
  const closed = await page.$$eval("[role=dialog]", (d) => d.length);
  console.log(JSON.stringify({ buttons, dlg, playing, overflowDelta: overflow, closed }));
  await browser.close();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });
