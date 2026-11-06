/* 字卡:卡片出現時不出聲;點卡片才唸;會了/再練可以用按鈕、滑動、鍵盤;
 * 練完可以只重練不熟的;學校單字按「會了」會在單字表打勾;選的範圍會記住。 */
import { getChromium, launchOpts, BASE, stubSpeech, onlyLocal, makeReporter, clickByText } from "./helpers.mjs";

const r = makeReporter("flash");
const chromium = await getChromium();
const browser = await chromium.launch(launchOpts());
const page = await browser.newPage({ viewport: { width: 400, height: 1000 } });
const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));
await onlyLocal(page);
await page.addInitScript(stubSpeech);
page.setDefaultTimeout(6000);

const body = () => page.locator("body").innerText();
const spoken = () => page.evaluate(() => window.__spoken.slice());
const exact = (txt) => page.evaluate((x) => {
  const b = [...document.querySelectorAll("#root button")].find((e) => e.innerText.trim() === x);
  if (b) { b.click(); return true; }
  return false;
}, txt);
const card = () => page.locator('[role="button"][aria-label^="字卡"]');
const cardWord = async () => (await card().innerText()).trim();
const swipe = async (dx) => {
  const box = await card().boundingBox();
  const y = box.y + box.height / 2, x = box.x + box.width / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + dx / 2, y, { steps: 4 }); await page.mouse.move(x + dx, y, { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(400);
};

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(500);
await clickByText(page, /^🃏 Sight Word 字卡$/);
await page.waitForTimeout(500);
let txt = await body();
r.check("Sight Word 字卡預設是常見字那一副", txt.includes("② 哪幾關"));

await exact("第 1 關");
await page.waitForTimeout(200);
txt = await body();
r.check("只選第 1 關:5 個字", txt.includes("I・a・the・to・and") && txt.includes("🃏 開始(5 張)"));
await exact("照順序");
await page.evaluate(() => { window.__spoken = []; });
await clickByText(page, /^🃏 開始/);
await page.waitForTimeout(900);
r.check("第一張是 I", (await cardWord()) === "I");
r.check("卡片出現時不會先唸", (await spoken()).length === 0, JSON.stringify(await spoken()));
await card().click();
await page.waitForTimeout(300);
r.check("點卡片才唸出來", (await spoken()).some((x) => x.toLowerCase() === "i"));

await exact("😀 會了");                       // I → 會了
await page.waitForTimeout(400);
r.check("按會了換下一張 a", (await cardWord()) === "a");
await swipe(-160);                             // a → 往左滑 = 再練
r.check("往左滑換下一張 the", (await cardWord()) === "the");
await swipe(160);                              // the → 往右滑 = 會了
r.check("往右滑換下一張 to", (await cardWord()) === "to");
await page.keyboard.press("ArrowLeft");        // to → 再練
await page.waitForTimeout(400);
r.check("鍵盤 ← 換下一張 and", (await cardWord()) === "and");
await page.keyboard.press("ArrowRight");       // and → 會了
await page.waitForTimeout(500);
txt = await body();
r.check("練完顯示 會了 3・再練 2", txt.includes("練完 5 張字卡") && txt.includes("會了 3 張・再練 2 張"));
const againWords = await page.evaluate(() => [...document.querySelectorAll("#root button")]
  .map((b) => b.innerText.trim()).filter((x) => x === "a" || x === "to"));
r.check("列出要再練的字 a、to", againWords.join(",") === "a,to", againWords.join(","));
await clickByText(page, /^🔁 再練這 2 張$/);
await page.waitForTimeout(400);
const w = await cardWord();
r.check("只重練不熟的 2 張", (await body()).includes("第 1 / 2 張") && ["a", "to"].includes(w), w);

// 範圍會記住
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await clickByText(page, /^🃏 Sight Word 字卡$/);
await page.waitForTimeout(400);
r.check("重新打開記得只選第 1 關", (await body()).includes("🃏 開始(5 張)"));

// 學校單字字卡:用和考試同一個範圍,會了會打勾
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await clickByText(page, /^🃏 學校單字字卡$/);
await page.waitForTimeout(400);
txt = await body();
r.check("學校單字字卡預設是上學期", txt.includes("和學校單字表的考試用同一個範圍"));
await clickByText(page, /^📋 改範圍$/);
await page.waitForTimeout(300);
await exact("第 2 行");
await exact("照單字表順序");
await clickByText(page, /^🃏 開始/);
await page.waitForTimeout(500);
r.check("第 2 行第一張是 she,共 15 張", (await cardWord()) === "she" && (await body()).includes("第 1 / 15 張"));
await exact("😀 會了");
await page.waitForTimeout(400);
const ticked = await page.evaluate(() => JSON.parse(localStorage.getItem("wordpop-school-words") || "[]"));
r.check("學校單字按會了,單字表上就打勾", ticked.includes("she"), JSON.stringify(ticked));

// 英文介面
await page.evaluate(() => localStorage.setItem("wordpop-lang", "en"));
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await clickByText(page, /^🃏 Sight Word Flashcards$/);
await page.waitForTimeout(400);
txt = await body();
r.check("英文介面翻好了", txt.includes("🃏 Which deck?") && txt.includes("② Levels") && !/[一-鿿]/.test(txt.split("Which deck?")[1]));

r.check("沒有 JS 錯誤", errs.length === 0, errs.slice(0, 2).join(" | "));
await browser.close();
r.finish();
