# 測試

用 Playwright 把真的瀏覽器開起來,操作真的畫面。刻意不依賴 npm 套件,
Playwright 從系統路徑載入,所以 `npm ci` 不會因此變慢。

## 跑法

```bash
npm run build
npx vite preview --port 4173 &     # 一定要跑「建置後」的版本,Service Worker 只在正式版註冊
npm test                            # 全部
node tests/smoke.mjs                # 單獨跑一支
```

覆寫預設路徑(換機器時):

```bash
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
CHROMIUM_PATH=/path/to/chromium \
WORDPOP_URL=http://localhost:4173/wordpop/ npm test
```

## 有哪些

| 檔案 | 測什麼 |
| --- | --- |
| `smoke.mjs` | 中英 × 三個科目分頁的每一個入口都進去點,只要有 JS 錯誤就失敗。改完 `App.jsx` 必跑 |
| `backup.mjs` | 備份 → 清光資料 → 還原,星星/進度/注音錄音都要一模一樣回來 |
| `offline.mjs` | Service Worker 裝得起來、斷網照樣能玩、部署新版一次重整就換新 |
| `bopomofo.mjs` | 有家長錄音時要播錄音,而且沒有任何地方偷用合成語音唸單一注音符號 |

`offline.mjs` 會暫時改 `src/App.jsx` 的版號、重建、再改回來,用來模擬部署新版。
不想讓它動到檔案就設 `WORDPOP_SKIP_UPDATE_TEST=1`。
