/* WordPop Service Worker — 讓遊戲在沒有網路時也能玩
 *
 * 為什麼需要:車上、捷運、飛機、收訊差的地方,正是最需要拿出來玩的時候,
 * 但沒有 SW 的話沒網路就是一片白。全部內容都是靜態的,快取起來幾乎沒有代價。
 *
 * 快取策略分三種:
 *   1) 導覽(開啟網頁):network-first —— 有網路時永遠拿得到新版本,
 *      沒網路才退回快取。這樣部署新版不會被舊快取卡住。
 *   2) 同源靜態檔(Vite 產生的 hash 檔名、圖示、manifest):cache-first ——
 *      檔名含 hash,內容不會變,直接用快取最快。
 *   3) 單字的真人發音 mp3 和字典 API:cache-first 但另開一個有上限的快取,
 *      第二次玩同一個單字就完全不吃網路。
 */
const VERSION = "v1";
const SHELL = `wordpop-shell-${VERSION}`;
const ASSETS = `wordpop-assets-${VERSION}`;
const MEDIA = `wordpop-media-${VERSION}`;
const KNOWN = [SHELL, ASSETS, MEDIA];

// 外部音源:Wiktionary 的發音檔和查詢用的字典 API
const MEDIA_HOSTS = /(^|\.)(wikimedia\.org|wikipedia\.org|dictionaryapi\.dev)$/i;
const MEDIA_MAX = 600; // 約 600 個單字的發音,超過就丟掉最舊的

const scopeUrl = (path) => new URL(path, self.registration.scope).toString();

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // 這幾個一定要先抓:沒有 index.html 就連開都開不起來
    await c.addAll(["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"]
      .map(scopeUrl)).catch(() => { /* 其中一個抓不到也不要讓安裝失敗 */ });
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((n) => n.startsWith("wordpop-") && !KNOWN.includes(n))
      .map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

// 頁面請求新版本時立刻接手,不用等所有分頁關掉
self.addEventListener("message", (e) => {
  if (e.data === "skip-waiting") self.skipWaiting();
});

async function trimCache(name, max) {
  const c = await caches.open(name);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

async function cacheFirst(req, cacheName, { trim } = {}) {
  const c = await caches.open(cacheName);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  // 只存成功、非 opaque 的回應;opaque 存了也讀不出內容,還會吃掉配額
  if (res && res.ok && res.type !== "opaque") {
    await c.put(req, res.clone());
    if (trim) trimCache(cacheName, trim);
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  let url;
  try { url = new URL(request.url); } catch { return; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // 1) 開啟網頁:先試網路,失敗才用快取的 index.html
  if (request.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const res = await fetch(request);
        if (res && res.ok) {
          const c = await caches.open(SHELL);
          c.put(scopeUrl("./"), res.clone());
        }
        return res;
      } catch {
        const c = await caches.open(SHELL);
        return (await c.match(scopeUrl("./"))) || (await c.match(request)) ||
          new Response("離線", { status: 503 });
      }
    })());
    return;
  }

  // 2) 同源靜態檔
  if (url.origin === self.location.origin) {
    e.respondWith(cacheFirst(request, ASSETS).catch(async () => {
      const c = await caches.open(ASSETS);
      return (await c.match(request)) || Response.error();
    }));
    return;
  }

  // 3) 外部發音檔與字典 API
  if (MEDIA_HOSTS.test(url.hostname)) {
    e.respondWith(cacheFirst(request, MEDIA, { trim: MEDIA_MAX }).catch(async () => {
      const c = await caches.open(MEDIA);
      return (await c.match(request)) || Response.error();
    }));
  }
});
