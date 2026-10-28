/* eslint-disable */
// Dev-only music check in a real headful browser (stock autoplay policy,
// no flags). Asserts the soundtrack does NOT start before any interaction
// and DOES start from the first click. A quick chime of audio is normal.
const puppeteer = require("puppeteer-core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const URL = "http://localhost:3459/";
const statusOf = (page) =>
  page.evaluate(() =>
    (
      document
        .getElementById("music")
        .textContent.match(/The song [^.]*\.|Warming up [^.]*\.|If music [^.]*\./) || ["?"]
    )[0]
  );
(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    args: ["--disable-gpu", "--window-size=1280,900", "--window-position=50,50"],
  });
  const page = (await browser.pages())[0] || (await browser.newPage());
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await sleep(6000);
  const before = await statusOf(page);
  console.log("before interaction :", before);
  console.log("no premature start :", before.includes("first touch"));

  await page.click(".fixed button");
  let playing = false;
  for (let t = 0; t < 10 && !playing; t++) {
    await sleep(1000);
    playing = (await statusOf(page)).includes("The song is playing now");
  }
  console.log("after open click   :", playing ? "PLAYING" : "still idle (check network/Spotify)");
  console.log("verdict            :", before.includes("first touch") && playing ? "PASS" : "FAIL");
  await browser.close();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
