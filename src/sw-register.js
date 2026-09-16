/* 註冊 Service Worker(只在正式站上跑,dev 不註冊免得快取住開發中的檔案)
 *
 * 更新流程:偵測到有新版本在等待,就叫它立刻接手並重整一次頁面。
 * 用 reloaded 旗標擋住重複重整,避免無限迴圈。
 */
export function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener("load", async () => {
    try {
      // BASE_URL 是 '/wordpop/'(見 vite.config.js),SW 必須放在這個範圍下
      const base = import.meta.env.BASE_URL;
      const reg = await navigator.serviceWorker.register(`${base}sw.js`, { scope: base });

      // 第一次安裝時 controller 本來就是空的,新 SW 接手會觸發 controllerchange——
      // 那次不能重整,不然每個人第一次打開都會莫名其妙閃一下。
      // 只有「本來就有舊版在跑」才代表這是更新,才需要重整換上新版。
      const hadController = !!navigator.serviceWorker.controller;
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || reloaded) return;
        reloaded = true;
        location.reload();
      });

      const promote = (worker) => {
        if (!worker) return;
        // 有舊版在跑才需要換手;第一次安裝直接接手就好,不用重整
        if (navigator.serviceWorker.controller) worker.postMessage("skip-waiting");
      };

      if (reg.waiting) promote(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        w?.addEventListener("statechange", () => {
          if (w.state === "installed") promote(w);
        });
      });
    } catch {
      // 註冊失敗就當作沒有離線功能,遊戲照常跑
    }
  });
}
