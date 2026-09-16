/* 測試共用工具
 *
 * 這些測試刻意不依賴 npm 套件:Playwright 從系統路徑載入(可用 PLAYWRIGHT_MODULE
 * 和 CHROMIUM_PATH 覆寫),所以 package.json 不用多背一個很重的 devDependency,
 * CI 的 npm ci 也不會變慢。
 */
export const BASE = process.env.WORDPOP_URL || "http://localhost:4173/wordpop/";

export async function getChromium() {
  const mod = process.env.PLAYWRIGHT_MODULE ||
    "/opt/node22/lib/node_modules/playwright/index.mjs";
  const { chromium } = await import(mod);
  return chromium;
}

export const launchOpts = () => ({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
});

/* 把語音引擎換成假的,這樣測試才能看到「程式交給引擎的是什麼」,
 * 而且不會因為測試機沒有語音就失敗。 */
export const stubSpeech = () => {
  window.__spoken = [];
  window.__played = [];
  class FakeUtt { constructor(text) { this.text = text; } }
  Object.defineProperty(window, "SpeechSynthesisUtterance",
    { value: FakeUtt, configurable: true, writable: true });
  const stub = {
    speaking: false, pending: false, paused: false,
    getVoices: () => [
      { name: "Mei-Jia", lang: "zh-TW", localService: true },
      { name: "Samantha", lang: "en-US", localService: true, default: true },
    ],
    speak(u) { window.__spoken.push(String(u.text)); if (u.onend) setTimeout(u.onend, 5); },
    cancel() {}, pause() {}, resume() {},
    addEventListener() {}, removeEventListener() {},
  };
  Object.defineProperty(window, "speechSynthesis",
    { value: stub, configurable: true, writable: true });
  HTMLMediaElement.prototype.play = function play() {
    window.__played.push(this.src);
    if (this.onended) setTimeout(() => this.onended(), 0);
    return Promise.resolve();
  };
};

/* 只讓 localhost 通過:外部字型和發音檔在 CI 通常連不出去,
 * 擋掉才不會每個測試都在等 timeout。 */
export const onlyLocal = (page) =>
  page.route("**/*", (r) => r.request().url().startsWith(new URL(BASE).origin)
    ? r.continue() : r.abort());

export function makeReporter(name) {
  const fails = [];
  return {
    check(label, ok, detail = "") {
      console.log(`  ${ok ? "✓" : "✗"} ${label}${detail ? ` — ${detail}` : ""}`);
      if (!ok) fails.push(label);
    },
    finish() {
      if (fails.length) {
        console.error(`\n✗ ${name}: ${fails.length} 項失敗 — ${fails.join(", ")}`);
        process.exitCode = 1;
      } else {
        console.log(`\n✓ ${name}: 全部通過`);
      }
    },
  };
}

/* 首頁的科目分頁(ABC / ㄅㄆㄇ / 數字),用索引點 */
export async function openSubject(page, index) {
  const ok = await page.evaluate((i) => {
    const tabs = [...document.querySelectorAll("#root button")]
      .filter((b) => /^(🔤|ㄅ\n|🔢)/.test(b.innerText));
    if (!tabs.length) return false;
    (tabs[i] || tabs[0]).click();
    return true;
  }, index);
  if (!ok) throw new Error("找不到科目分頁");
  await page.waitForTimeout(400);
}

export async function clickByText(page, re) {
  return page.evaluate((src) => {
    const rx = new RegExp(src);
    const b = [...document.querySelectorAll("#root button")].find((x) => rx.test(x.innerText));
    if (!b) return null;
    b.click();
    return b.innerText.trim();
  }, re.source);
}
