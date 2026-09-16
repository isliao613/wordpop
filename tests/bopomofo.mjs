/* 注音發音:家長錄的音檔要蓋過合成語音,
 * 而且不能有任何地方偷偷用 TTS 去唸單一注音符號或代表字(那正是聽起來很怪的原因)。 */
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter, openSubject } from "./helpers.mjs";

const SYMS = "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ".split("");
const PROXY = ["波", "坡", "摸", "佛", "德", "特", "呢", "勒", "哥", "科", "喝"];

const r = makeReporter("bopomofo");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 420, height: 1100 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);
await page.addInitScript(stubSpeech);
await page.addInitScript(([syms, proxy]) => {
  window.SYMSET = new Set(syms);
  window.PROXYSET = new Set(proxy);
}, [SYMS, PROXY]);
page.setDefaultTimeout(6000);

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);

// 先幫 37 個符號都塞一段假錄音
await page.evaluate(async (syms) => {
  await new Promise((res, rej) => {
    const req = indexedDB.open("wordpop-bopo-audio", 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("clips")) req.result.createObjectStore("clips");
    };
    req.onsuccess = () => {
      const st = req.result.transaction("clips", "readwrite").objectStore("clips");
      syms.forEach((s) => st.put(new Blob([new Uint8Array([1, 2, 3])], { type: "audio/webm" }), s));
      st.transaction.oncomplete = res;
      st.transaction.onerror = rej;
    };
    req.onerror = rej;
  });
}, SYMS);
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);

let checked = 0;
const leaked = [];
let clipsPlayed = 0;
await openSubject(page, 1);
const labels = await page.evaluate(() => [...document.querySelectorAll("#root button")]
  .map((x) => x.innerText.trim()).filter((x) => x && x.length < 44 && /注音|拼音|韻母|聲調|符號/.test(x)));

for (const label of [...new Set(labels)].slice(0, 10)) {
  await page.evaluate(() => { window.__played = []; window.__spoken = []; });
  await page.evaluate((l) => {
    const b = [...document.querySelectorAll("#root button")].find((x) => x.innerText.trim() === l);
    if (b) b.click();
  }, label);
  await page.waitForTimeout(700);
  const btns = page.locator("#root button");
  const n = Math.min(await btns.count(), 12);
  for (let j = 0; j < n; j++) {
    try { await btns.nth(j).click({ timeout: 400 }); await page.waitForTimeout(120); } catch { /* ignore */ }
  }
  await page.waitForTimeout(400);
  const res = await page.evaluate(() => ({ played: window.__played.length, spoken: window.__spoken.slice() }));
  clipsPlayed += res.played;
  const bare = res.spoken.filter((s) => SYMS.includes(s) || PROXY.includes(s));
  if (bare.length) leaked.push(`${label}: ${bare.join("")}`);
  checked++;
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await openSubject(page, 1);
}

r.check(`跑過 ${checked} 個注音遊戲`, checked > 0);
r.check("有錄音時改播錄音", clipsPlayed > 0, `播了 ${clipsPlayed} 次`);
r.check("沒有任何地方用合成語音唸單一注音/代表字", leaked.length === 0, leaked.slice(0, 3).join(" | "));
r.check("沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
await browser.close();
r.finish();
