/* 備份與還原:存檔 → 清光所有資料 → 還原 → 資料要一模一樣回來 */
import { readFileSync } from "node:fs";
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter } from "./helpers.mjs";

const r = makeReporter("backup");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const ctx = await browser.newContext({ acceptDownloads: true });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);
await page.addInitScript(stubSpeech);

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);

await page.evaluate(async () => {
  localStorage.setItem("wordpop-stars", "42");
  localStorage.setItem("wordpop-school-words", JSON.stringify(["cat", "dog"]));
  localStorage.setItem("wordpop-subject", "bopo");
  await new Promise((res, rej) => {
    const req = indexedDB.open("wordpop-bopo-audio", 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("clips")) req.result.createObjectStore("clips");
    };
    req.onsuccess = () => {
      const st = req.result.transaction("clips", "readwrite").objectStore("clips");
      st.put(new Blob([new Uint8Array([11, 22, 33])], { type: "audio/webm" }), "ㄅ");
      st.put(new Blob([new Uint8Array([44, 55])], { type: "audio/webm" }), "ㄆ");
      st.transaction.oncomplete = res;
      st.transaction.onerror = rej;
    };
    req.onerror = rej;
  });
});
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);

const open = async (re) => page.evaluate((src) => {
  const b = [...document.querySelectorAll("button")].find((x) => new RegExp(src).test(x.innerText));
  if (b) b.click();
}, re.source);

await open(/備份與還原|Backup and restore/);
await page.waitForTimeout(300);
const dl = page.waitForEvent("download", { timeout: 10000 });
await open(/下載備份檔|Download a backup/);
const file = await dl;
const path = await file.path();
const json = JSON.parse(readFileSync(path, "utf8"));

r.check("備份檔含星星", json.local["wordpop-stars"] === "42");
r.check("備份檔含學校單字進度", json.local["wordpop-school-words"] === '["cat","dog"]');
r.check("備份檔含 2 個注音錄音", Object.keys(json.clips).length === 2, Object.keys(json.clips).join(""));
r.check("錄音存成 data URL", String(json.clips["ㄅ"]).startsWith("data:audio/"));
r.check("不含單字音檔網路快取", !("wordpop-audio-cache" in json.local));

// 清光,模擬 Safari 7 天規則
await page.evaluate(async () => {
  localStorage.clear();
  await new Promise((res) => {
    const req = indexedDB.deleteDatabase("wordpop-bopo-audio");
    req.onsuccess = res; req.onerror = res; req.onblocked = res;
  });
});
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(700);

await open(/備份與還原|Backup and restore/);
await page.waitForTimeout(300);
await page.setInputFiles('input[type=file][accept*="json"]', path);
await page.waitForTimeout(2500);   // 還原後會自動重整

const after = await page.evaluate(async () => {
  const clips = await new Promise((res) => {
    const req = indexedDB.open("wordpop-bopo-audio", 1);
    req.onsuccess = () => {
      const q = req.result.transaction("clips", "readonly").objectStore("clips").getAllKeys();
      q.onsuccess = () => res(q.result);
    };
    req.onerror = () => res([]);
  });
  return {
    stars: localStorage.getItem("wordpop-stars"),
    school: localStorage.getItem("wordpop-school-words"),
    subject: localStorage.getItem("wordpop-subject"),
    clips,
  };
});

r.check("還原後星星回來了", after.stars === "42", `得到 ${after.stars}`);
r.check("還原後學校進度回來了", after.school === '["cat","dog"]');
r.check("還原後分頁選擇回來了", after.subject === "bopo");
r.check("還原後 2 個錄音都回來了", after.clips.length === 2, after.clips.join(""));
r.check("沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));

await browser.close();
r.finish();
