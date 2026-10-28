/* eslint-disable */
// Dev-only verification script (not part of the site build).
const puppeteer = require("puppeteer-core");
const fs = require("fs");

const OUT = process.env.TEMP + "\\opencode\\shots";
const URL = "http://localhost:3459/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = [];

async function checkWidth(page, label) {
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  report.push(
    `${label}: client=${m.clientW} scroll=${m.scrollW} => ${m.scrollW > m.clientW ? "H-OVERFLOW" : "ok"}`
  );
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--disable-gpu", "--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await sleep(1500);
  await checkWidth(page, "DESKTOP intro");

  // open the surprise
  await page.click(".fixed button");
  await sleep(2400);
  await checkWidth(page, "DESKTOP after open");

  // scroll to gallery
  await page.evaluate(() => document.getElementById("moments").scrollIntoView());
  await sleep(2600);

  // count cards + click a genuine video card (polaroid 02)
  const cards = await page.$$eval("#moments .grid button", (b) => b.length);
  report.push("gallery buttons: " + cards);

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("#moments .grid button"));
    btns[1].click();
  });
  await sleep(2800);
  const dlg1 = await page.$eval("[role=dialog]", (el) => el.getAttribute("aria-label"));
  report.push("lightbox opened: " + JSON.stringify(dlg1));

  const vstate = await page.evaluate(() => {
    const v = document.querySelector("video");
    if (!v) return "NO VIDEO ELEMENT";
    return `paused=${v.paused} currentSrc=${v.currentSrc.split("/").pop()} err=${v.error}`;
  });
  report.push("video state: " + vstate);

  // only one video on the page
  const videoCount = await page.$$eval("video", (vs) => vs.length);
  report.push("video element count: " + videoCount);

  await page.screenshot({ path: OUT + "\\d-lightbox.png" });

  // arrow navigation
  await page.keyboard.press("ArrowRight");
  await sleep(1200);
  const dlg2 = await page.$eval("[role=dialog]", (el) => el.getAttribute("aria-label"));
  report.push("after ArrowRight: " + JSON.stringify(dlg2));

  // Escape closes and returns focus
  await page.keyboard.press("Escape");
  await sleep(1300);
  const dlgGone = await page.$$eval("[role=dialog]", (d) => d.length);
  const focusLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName);
  report.push(`esc: dialogs left=${dlgGone}, focus returned to: ${focusLabel}`);
  await checkWidth(page, "DESKTOP after ecs close");

  // filter chips: favorites
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll("#moments [role=group] button"));
    chips.find((c) => c.textContent.trim() === "Favorite Moments").click();
  });
  await sleep(1400);
  const favCount = await page.$$eval("#moments .grid button", (b) => b.length);
  report.push("favorites filter -> cards: " + favCount + " (was " + cards + ")");
  await page.screenshot({ path: OUT + "\\d-filter.png" });

  // back to all, open a missing-media case? none -- open first cinematic, close
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll("#moments [role=group] button"));
    chips.find((c) => c.textContent.trim() === "All Moments").click();
  });
  await sleep(1200);

  // photo lightbox
  await page.evaluate(() => document.getElementById("frames").scrollIntoView());
  await sleep(2200);
  await page.evaluate(() => {
    const btn = document.querySelector("#frames button");
    btn.click();
  });
  await sleep(2000);
  const pdlg = await page.$eval("[role=dialog]", (el) => el.getAttribute("aria-label"));
  report.push("photo lightbox: " + JSON.stringify(pdlg));
  const imgCount = await page.$$eval("[role=dialog] img", (i) => i.length);
  report.push("photo lightbox img count: " + imgCount);
  await page.screenshot({ path: OUT + "\\d-photo-dialog.png" });
  await page.keyboard.press("Escape");
  await sleep(1200);

  // music section screenshot (desktop)
  await page.evaluate(() => document.getElementById("music").scrollIntoView({ block: "center" }));
  await sleep(2600);
  await page.screenshot({ path: OUT + "\\d-music.png" });
  const embedBox = await page.$eval("#music iframe", (f) => {
    const r = f.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  report.push("spotify embed box: " + JSON.stringify(embedBox));

  // soundtrack auto-start state via the official iFrame API
  const musicState = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll("#music iframe"));
    const text = document.getElementById("music").textContent;
    return {
      iframeCount: iframes.length,
      iframeTitle: iframes.map((f) => f.getAttribute("title")).join("|"),
      iframeSrcHost: iframes.map((f) => (f.src.startsWith("https://open.spotify.com") ? "open.spotify.com" : f.src.slice(0, 40))).join("|"),
      allowAttr: iframes.map((f) => f.getAttribute("allow")).join("|"),
      hasPlayingLabel: text.includes("Playing: "),
      hasPlayingStatus: text.includes("The song is playing now"),
      hasPausedStatus: text.includes("The song is waiting"),
    };
  });
  report.push("music iframe state: " + JSON.stringify(musicState));

  // letter + replay (desktop)
  await page.evaluate(() => document.getElementById("letter").scrollIntoView());
  await sleep(2400);
  await page.screenshot({ path: OUT + "\\d-letter.png" });
  await page.evaluate(() => {
    const btn = document.querySelector("#letter button");
    btn.click();
  });
  await sleep(2000);
  const h1Back = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 && h1.getClientRects().length > 0 && getComputedStyle(h1).opacity === "1";
  });
  report.push("replay -> intro visible again: " + h1Back);
  await checkWidth(page, "DESKTOP after replay");

  await browser.close();
  console.log(report.join("\n"));
})().catch((e) => {
  console.error("SCRIPT-ERROR", e);
  process.exit(1);
});


