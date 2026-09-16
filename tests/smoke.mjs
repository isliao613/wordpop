/* 全站煙霧測試:中英兩種語言 × 三個科目分頁,每個入口都進去點幾下,
 * 只要有任何 JS 錯誤就算失敗。這是改完 App.jsx 之後最該跑的一支。 */
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter, openSubject } from "./helpers.mjs";

const r = makeReporter("smoke");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 420, height: 1100 } });
const errs = [];
page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  const t = m.text();
  if (m.type() === "error" && !/Failed to load resource|net::/.test(t)) errs.push(`console: ${t}`);
});
await onlyLocal(page);
await page.addInitScript(stubSpeech);
page.setDefaultTimeout(6000);

for (const lang of ["zh", "en"]) {
  let ran = 0;
  const broken = [];
  for (let tab = 0; tab < 3; tab++) {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.evaluate((l) => { try { localStorage.setItem("wordpop-lang", l); } catch { /* ignore */ } }, lang);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    await openSubject(page, tab);

    const labels = await page.evaluate(() => [...document.querySelectorAll("#root button")]
      .map((x) => x.innerText.trim())
      .filter((x) => x && x.length < 44
        && /^[\p{Emoji_Presentation}\u{1F300}-\u{1FAFF}☀-➿]/u.test(x)
        && !/^🎈|^⭐|^🌐|^🔍|^🧹|^👨|^💾/.test(x)));

    for (const label of [...new Set(labels)]) {
      const before = errs.length;
      try {
        await page.evaluate((l) => {
          const b = [...document.querySelectorAll("#root button")].find((x) => x.innerText.trim() === l);
          if (b) b.click();
        }, label);
        await page.waitForTimeout(500);
        const btns = page.locator("#root button");
        const n = Math.min(await btns.count(), 8);
        for (let j = 0; j < n; j++) {
          try { await btns.nth(j).click({ timeout: 400 }); await page.waitForTimeout(90); } catch { /* 按不到就跳過 */ }
        }
        await page.waitForTimeout(250);
      } catch (e) {
        errs.push(`nav ${label}: ${e.message}`);
      }
      if (errs.length > before) broken.push(label);
      ran++;
      await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(250);
      await openSubject(page, tab);
    }
  }
  r.check(`${lang}:${ran} 個入口全部正常`, broken.length === 0, broken.slice(0, 5).join(", "));
}

r.check("沒有任何 JS 錯誤", errs.length === 0, errs.slice(0, 3).join(" | "));
await browser.close();
r.finish();
