/* 離線能力:裝好 Service Worker → 斷網 → 還是要能開、能進遊戲。
 * 另外驗證部署新版時不會被舊快取卡住(這點壞掉會讓所有人永遠停在舊版)。 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { getChromium, launchOpts, BASE, onlyLocal, makeReporter } from "./helpers.mjs";

const r = makeReporter("offline");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const ctx = await browser.newContext();
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);

await page.goto(BASE, { waitUntil: "load" });
await page.evaluate(() => navigator.serviceWorker.ready);
const reg = await page.evaluate(async () => {
  const x = await navigator.serviceWorker.getRegistration();
  return x ? { scope: x.scope, state: x.active?.state } : null;
});
r.check("Service Worker 裝好了", reg?.state === "activated", reg?.scope);

// 第一次造訪不該被重整(以前這裡會閃一下)
const navs = [];
page.on("framenavigated", (f) => { if (f === page.mainFrame()) navs.push(f.url()); });
await page.waitForTimeout(1200);
r.check("第一次造訪不會自己重整", navs.length === 0, `重整了 ${navs.length} 次`);

await page.reload({ waitUntil: "load" });
await page.waitForTimeout(1000);
r.check("SW 接管頁面", await page.evaluate(() => !!navigator.serviceWorker.controller));

await ctx.setOffline(true);
await page.reload({ waitUntil: "load" });
await page.waitForTimeout(1500);
const body = await page.locator("body").innerText();
r.check("斷網後首頁照樣開得起來", body.includes("WordPop"));
r.check("斷網後看得到遊戲選單", /認識單字|Meet the Words/.test(body));

// 「🧠 認識單字」是分類標題,要先展開再點裡面的遊戲
await page.evaluate(() => {
  const b = [...document.querySelectorAll("#root button")].find((x) => /認識單字/.test(x.innerText));
  if (b) b.click();
});
await page.waitForTimeout(500);
const game = await page.evaluate(() => {
  const b = [...document.querySelectorAll("#root button")].find((x) => /^📚 學習單字$/.test(x.innerText.trim()));
  if (b) { b.click(); return true; }
  return false;
});
await page.waitForTimeout(900);
const afterClick = await page.locator("body").innerText();
r.check("斷網後進得去遊戲", game && !/🧠 認識單字[\s\S]*📚 學習單字/.test(afterClick));
r.check("離線時沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
await ctx.setOffline(false);

// 部署新版之後,重整一次就要換到新版
if (process.env.WORDPOP_SKIP_UPDATE_TEST !== "1") {
  // 版號搬過家(App.jsx → theme.js),所以別寫死檔名,找出真的宣告它的那個檔
  const CANDIDATES = ["../src/theme.js", "../src/App.jsx"];
  const RE = /const APP_VERSION = "(v[\d.]+)";/;
  let APP = null, orig = null, cur = null;
  for (const rel of CANDIDATES) {
    const path = new URL(rel, import.meta.url).pathname;
    const text = readFileSync(path, "utf8");
    const m = text.match(RE);
    if (m) { APP = path; orig = text; cur = m[1]; break; }
  }
  if (!APP) throw new Error("找不到宣告 APP_VERSION 的檔案,測試需要更新");
  try {
    writeFileSync(APP, orig.replace(RE, 'const APP_VERSION = "v9.99";'));
    execSync("npm run build", { cwd: new URL("..", import.meta.url).pathname, stdio: "pipe" });
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(2500);
    const shown = (await page.locator("body").innerText()).match(/WordPop v[\d.]+/)?.[0];
    r.check("部署新版後一次重整就換新", shown === "WordPop v9.99", `顯示 ${shown}`);
  } finally {
    writeFileSync(APP, orig);
    execSync("npm run build", { cwd: new URL("..", import.meta.url).pathname, stdio: "pipe" });
  }
}

await browser.close();
r.finish();
