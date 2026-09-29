/* 注音發音:合成語音唸不準注音符號,所以會唸出注音符號的遊戲已從選單拿掉。
 * 這支測試確認:
 *   1) 那些遊戲真的不在 ㄅㄆㄇ 分頁上
 *   2) 留下來的每一個遊戲,交給語音引擎的文字裡都沒有注音符號、也沒有單獨的代表字 */
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter, openSubject } from "./helpers.mjs";

const HIDDEN = [
  "📚 認識注音", "ㄅ ㄅㄆㄇ 接接看", "🔍 注音獵人", "🔎 韻母偵探", "🫧 注音泡泡",
  "🚂 拼音小火車", "🅰️ 中間的音(介音)", "👨‍👩‍👧 韻母家族", "🧩 拼注音小廚師",
  "🧩 注音配對", "🔎 注音找找看", "🔠 聲母還是韻母?", "🕵️ 少了誰?(注音)",
  "🧠 記憶排排看(注音)", "⚡ 注音快手", "🎴 注音翻翻樂",
];
// 代表字:ㄅㄆㄇ… 用來「唸」符號的字(單獨出現就是在唸注音)
const PROXY = new Set(["波", "坡", "摸", "佛", "德", "特", "呢", "勒", "哥", "科", "喝",
  "基", "欺", "希", "知", "吃", "詩", "日", "資", "疵", "思", "啊", "喔", "鵝", "耶",
  "哀", "欸", "凹", "歐", "安", "恩", "骯", "亨", "兒", "衣", "烏", "迂"]);
const BOPO_CHAR = /[ㄅ-ㄩˇˊˋ˙]/;

const r = makeReporter("bopomofo");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 420, height: 1100 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);
await page.addInitScript(stubSpeech);
page.setDefaultTimeout(6000);

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
await openSubject(page, 1);

const labels = await page.evaluate(() => [...document.querySelectorAll("#root button")]
  .map((x) => x.innerText.trim())
  .filter((x) => x && x.length < 44
    && !x.includes("\n")                               // 科目分頁是「圖示\n名稱」兩行
    && /^[\p{Emoji_Presentation}\u{1F300}-\u{1FAFF}\u2190-\u21FF\u2600-\u27BF\u3105]/u.test(x)
    && !/^🎈|^⭐|^🌐|^🔍 注音發音檢查|^🧹|^👨‍👩‍👧 給爸媽|^💾|^🔤$|^🔢$/.test(x)
    && x !== "ㄅ\nㄅㄆㄇ"));
const visible = [...new Set(labels)];
const stillShown = HIDDEN.filter((h) => visible.includes(h));
r.check("會唸注音符號的 16 個遊戲都不在選單上", stillShown.length === 0, stillShown.join("、"));
r.check("ㄅㄆㄇ 分頁剩 14 個遊戲(含靜音的注音手寫)", visible.length === 14, `實際 ${visible.length}:${visible.join("、")}`);

const leaked = [];
let totalSpoken = 0;
for (const label of visible) {
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
  await page.waitForTimeout(500);
  const spoken = await page.evaluate(() => window.__spoken.slice());
  totalSpoken += spoken.length;
  const bad = spoken.filter((x) => BOPO_CHAR.test(x) || PROXY.has(x.trim()));
  if (bad.length) leaked.push(`${label}: ${bad.slice(0, 3).join(" / ")}`);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await openSubject(page, 1);
}

r.check("留下的遊戲都有在發聲(測試有真的點到)", totalSpoken > visible.length, `共 ${totalSpoken} 句`);
r.check("留下的遊戲沒有唸任何注音符號或代表字", leaked.length === 0, leaked.slice(0, 4).join(" | "));
r.check("沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
await browser.close();
r.finish();
