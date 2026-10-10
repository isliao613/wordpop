/* 學校單字表:可以照紙本「一行一行、一排一排」或自己挑字來考,順序和題數可選,範圍會記住 */
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter, clickByText } from "./helpers.mjs";

const r = makeReporter("school");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 400, height: 1100 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);
await page.addInitScript(stubSpeech);
page.setDefaultTimeout(6000);

const body = () => page.locator("body").innerText();
const exact = (txt) => page.evaluate((x) => {
  const b = [...document.querySelectorAll("#root button")].find((e) => e.innerText.trim() === x && !e.disabled);
  if (b) { b.click(); return true; }
  return false;
}, txt);
const spoken = () => page.evaluate(() => window.__spoken.slice());
const resetSpoken = () => page.evaluate(() => { window.__spoken = []; });
// 一題一題答:每題按正確答案(從語音知道目標字),回傳出題順序
async function answerAll(n) {
  const order = [];
  for (let i = 0; i < n; i++) {
    await page.waitForTimeout(700);
    const s = await spoken();
    const target = s.filter((x) => x !== "Great job!").pop();
    // 單獨的大寫 I 會被轉成小寫交給語音引擎(免得唸成 capital I),所以不分大小寫找按鈕
    const shown = await page.evaluate((x) => {
      const b = [...document.querySelectorAll("#root button")]
        .find((e) => e.innerText.trim().toLowerCase() === String(x).toLowerCase() && !e.disabled);
      if (b) { b.click(); return b.innerText.trim(); }
      return null;
    }, target);
    order.push(shown);
    await resetSpoken();
    await page.waitForTimeout(1900);
  }
  return order;
}
const openSchool = async () => {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  await clickByText(page, /^📋 學校單字表$/);
  await page.waitForTimeout(600);
};

await openSchool();
let txt = await body();
r.check("單字表照紙本分成第 1/2/3 行", /第 1 行[\s\S]*第 2 行[\s\S]*第 3 行/.test(txt));

// --- 只考第 2 行,照單字表順序,全部 15 個 ---
await clickByText(page, /^🎯 來考考我$/);
await page.waitForTimeout(400);
r.check("按考考我會先讓你選範圍", (await body()).includes("① 範圍"));
await exact("第 2 行");
await exact("照單字表順序");
await page.waitForTimeout(200);
r.check("選一整行時題數自動變成全部", /🎯 開始考\(15 題\)/.test(await body()));
await resetSpoken();
await clickByText(page, /^🎯 開始考/);
await page.waitForTimeout(300);
r.check("第 2 行共 15 題", (await body()).includes("第 1 / 15 題"));
const col2 = await answerAll(3);
r.check("照單字表順序出題(she → see → look)", col2.join(",") === "she,see,look", col2.join(","));

// --- 只考第 1 橫排(I / she / go)---
await openSchool();
await clickByText(page, /^🎯 來考考我$/);
await page.waitForTimeout(400);
await exact("第 2 行");                          // 先只選第 2 行
await page.evaluate(() => {                      // 再點上面的「第 2 行」把它整行取消 → 0 個
  const hs = [...document.querySelectorAll("#root button")].filter((b) => b.innerText.trim() === "第 2 行");
  hs[hs.length - 1].click();
});
await page.waitForTimeout(200);
r.check("一個字都沒選時不能開始", (await body()).includes("先選幾個字"));
await page.evaluate(() => document.querySelector('[aria-label="第 1 排"]').click());
await exact("照單字表順序");
await page.waitForTimeout(200);
await resetSpoken();
await clickByText(page, /^🎯 開始考/);
await page.waitForTimeout(300);
r.check("第 1 排共 3 題", (await body()).includes("第 1 / 3 題"));
const row1 = await answerAll(3);
r.check("第 1 排照順序是 I → she → go", row1.join(",") === "I,she,go", row1.join(","));
await page.waitForTimeout(600);
r.check("考完有結果頁", /答對 3 \/ 3 個字/.test(await body()));

// --- 範圍會記住 ---
await openSchool();
r.check("重新打開還記得上次的範圍", /上次的範圍:自選 3 個字・照單字表順序・3 個字/.test(await body()));

// --- 自己挑字 + 打亂 + 只考 5 個 ---
await clickByText(page, /^🎯 來考考我$/);
await page.waitForTimeout(400);
await exact("全部");
await exact("打亂順序");
await exact("5 個");
await page.waitForTimeout(200);
r.check("全部 45 個只考 5 個", /🎯 開始考\(5 題\)/.test(await body()));

// --- 唸學校單字也能選範圍 ---
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
await clickByText(page, /^🎤 學校單字跟讀$/);
await page.waitForTimeout(600);
r.check("唸單字遊戲顯示目前範圍", /📋 範圍:/.test(await body()));
await clickByText(page, /^📋 範圍:/);
await page.waitForTimeout(400);
await exact("第 3 行");
await exact("照單字表順序");
await exact("全部 15 個");
await clickByText(page, /^🎤 開始唸/);
await page.waitForTimeout(500);
txt = await body();
r.check("唸單字從第 3 行第一個字 go 開始", /第 1 \/ 15 個/.test(txt) && /\ngo\n/.test(txt), txt.match(/第 \d+ \/ \d+ 個/)?.[0]);
await clickByText(page, /^下一個 →$/);
await page.waitForTimeout(300);
r.check("下一個是 from", /\nfrom\n/.test(await body()));

// --- 英文介面 ---
await page.evaluate(() => localStorage.setItem("wordpop-lang", "en"));
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
await clickByText(page, /^📋 School Word List$/);
await page.waitForTimeout(500);
await clickByText(page, /^🎯 Quiz me$/);
await page.waitForTimeout(400);
txt = await body();
r.check("英文介面的範圍選單翻好了", txt.includes("① Which words") && txt.includes("Column 1") && !/[第範圍順序]/.test(txt.split("① Which words")[1].split("Cancel")[0]));

r.check("沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
await browser.close();
r.finish();
