/* 學校單字跟讀:換字自動先唸一次;收音判讀寬鬆(近音字也算對),但唸成另一個學校單字不算;
 * 開始收音時不能有示範音在播;機器聽錯時家長可以直接算對。
 * 語音辨識用假的:測試設定 window.__srSay = 這次「聽到」的句子。 */
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter, clickByText } from "./helpers.mjs";

const r = makeReporter("schoolsay");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 400, height: 1000 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);
await page.addInitScript(stubSpeech);
await page.addInitScript(() => {
  window.__srSay = "";
  window.__srStarted = 0;
  class FakeSR {
    start() {
      window.__srStarted++;
      window.__spokenAtListen = window.__spoken.length;
      this._t = setTimeout(() => {
        if (!window.__srSay) return;
        const alt = { transcript: window.__srSay, confidence: 0.6 };
        const res = Object.assign([alt], { isFinal: true });
        this.onresult && this.onresult({ results: [res] });
      }, 150);
    }
    stop() { clearTimeout(this._t); setTimeout(() => this.onend && this.onend(), 20); }
    abort() { clearTimeout(this._t); }
  }
  window.SpeechRecognition = FakeSR;
  window.webkitSpeechRecognition = FakeSR;
  // 第 1 行、照單字表順序:I → am → the → a …
  localStorage.setItem("wordpop-school-plan", JSON.stringify({ s1: {
    pick: ["I","am","the","a","to","like","he","is","have","my","we","make","me","for","with"],
    order: "sheet", cap: 0 } }));
});
page.setDefaultTimeout(6000);

const body = () => page.locator("body").innerText();
const spoken = () => page.evaluate(() => window.__spoken.slice());

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
await page.evaluate(() => { window.__spoken = []; });
await clickByText(page, /^🎤 學校單字跟讀$/);
await page.waitForTimeout(1200);
let s = await spoken();
r.check("一進來就自動先唸第一個字", s.some((x) => x.toLowerCase() === "i"), JSON.stringify(s));
let txt = await body();
r.check("按鈕改成「再聽一次」", txt.includes("🔊 再聽一次") && !txt.includes("先聽一次"));

// 下一個字也會自動唸
await page.evaluate(() => { window.__spoken = []; });
await clickByText(page, /^下一個 →$/);
await page.waitForTimeout(1200);
r.check("換到下一個字(am)自動唸", (await spoken()).includes("am"), JSON.stringify(await spoken()));

// 小朋友唸 am,辨識成 um → 要算對
await page.evaluate(() => { window.__srSay = "um"; });
await clickByText(page, /^🎤 換我唸!$/);
await page.waitForTimeout(800);
r.check("am 被聽成 um 也算對", (await body()).includes("唸對了"));

// 換字後馬上按換我唸:自動唸要被取消,收音時不能有示範音
await clickByText(page, /^下一個 →$/);           // → the
await page.waitForTimeout(100);
await page.evaluate(() => { window.__srSay = "duh"; window.__spoken = []; });
await clickByText(page, /^🎤 換我唸!$/);           // 在 450ms 自動唸之前
await page.waitForTimeout(900);
s = await spoken();
r.check("馬上開始收音時,自動示範音被取消", !s.includes("the"), JSON.stringify(s));
r.check("the 被聽成 duh 也算對", (await body()).includes("唸對了"));

// 唸成另一個學校單字不算:目標 a,聽到 the → 時間到才判沒過
await clickByText(page, /^下一個 →$/);           // → a
await page.waitForTimeout(700);
await page.evaluate(() => { window.__srSay = "the"; });
await clickByText(page, /^🎤 換我唸!$/);
await page.waitForTimeout(1200);
r.check("沒中時繼續聽,不會第一句就判錯", (await body()).includes("聽你說"));
await page.waitForTimeout(7000);
txt = await body();
r.check("唸成另一個學校單字(the)不算對", txt.includes("再試一次") && !txt.includes("🎉 唸對了"));
r.check("沒過時有家長按的「其實唸對了」", txt.includes("其實唸對了"));
await clickByText(page, /其實唸對了/);
await page.waitForTimeout(300);
r.check("家長按了就算過", (await body()).includes("🎉 唸對了"));

r.check("沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
await browser.close();
r.finish();
