# WordPop 🎈 英語發音學習遊戲

給幼兒園大班孩子(5–6 歲)的英語啟蒙遊戲，涵蓋**聽、說、讀、寫、算、理解**六大面向,並含 ㄅㄆㄇ 注音，共 **36 個小遊戲**。真人發音優先、答錯永遠給鼓勵、大按鈕高對比、進度自動保存。

▶️ **線上遊玩**：<https://isliao613.github.io/wordpop/>

## ✨ 特色

- **36 個遊戲**，依能力分成 11 組：認識單字、聽聲音找字、聽懂句子、拼讀 Phonics、拼字與字母、ㄅㄆㄇ 注音、數字與算數、動動腦、故事與分類、常見字 Sight Words、開口與動手
- **ㄅㄆㄇ 注音**：37 個注音符號與例詞，使用裝置的中文(zh-TW)語音；注音手寫採**教育部標準筆順**,田字格 + 真實楷體字形
- **真人發音優先**：單字優先播 Wiktionary 真人錄音，查無音檔自動退回合成語音；音量正規化、跨裝置一致
- **手寫練習**：A–Z 大小寫描寫，四線三格習字格、筆順編號與箭頭、筆順示範動畫、強制正確筆順與方向、支援 Apple Pencil(防手掌誤觸 + 筆壓)
- **兒童友善**：答錯只給溫柔提示不給挫折、星星與皇冠獎勵、關卡地圖、每一關都保證能過
- **語音辨識口說**：「跟讀小勇士」用 Web Speech API 練發音
- 進度存在 `localStorage`，無帳號、無伺服器、無追蹤

## 🎮 遊戲一覽

| 分組 | 遊戲 |
|---|---|
| 🧠 認識單字 | 學習單字、發音練習 |
| 👂 聽聲音找字 | 聽力挑戰、首音偵探、尾音偵探、押韻火車、單字泡泡 |
| 💬 聽懂句子 | 聽指令點圖、是不是?、數數小市場、聽顏色著色、在哪裡? |
| 📖 拼讀 Phonics | 音節拍拍、中間的音、拼讀小火車 |
| 🧩 拼字與字母 | 拼字小廚師、大小寫配對、字母獵人、ABC 接接看、大寫還是小寫? |
| ㄅ 注音 ㄅㄆㄇ | ㄅㄆㄇ 接接看、注音獵人、注音配對、注音手寫 |
| 🔢 數字與算數 | 數字接龍、加加看 |
| 🧠 動動腦 | 少了誰?、相反詞配對、記憶排排看、排大小 |
| 📖 故事與分類 | 迷你小故事、分類小幫手 |
| 🔤 常見字 Sight Words | 認字快手、單字翻翻樂 |
| 🗣️ 開口與動手 | 跟讀小勇士、手寫練習 |

## 🛠️ 技術

React + Vite，單一元件 `src/App.jsx`。GitHub Actions 自動部署到 GitHub Pages。

## 💻 本機開發

```bash
npm install
npm run dev      # 本機預覽 http://localhost:5173/wordpop/
npm run build    # 建置(推送前務必通過)
```

推送到 `main` 會由 GitHub Actions 自動建置並部署。

### 首次部署設定(只做一次)

到 repo 的 **Settings → Pages → Source** 選 **GitHub Actions**，等 Actions 跑完即可。
若 repo 名稱不是 `wordpop`，需同步修改 `vite.config.js` 的 `base`。

## 📋 版本紀錄

見 [CHANGELOG.md](./CHANGELOG.md)。

## 📄 授權

程式碼:[MIT](./LICENSE) © isliao613

**例外**:`src/bopomofoStrokes.js` 的注音符號筆順資料來自教育部
[常用國字標準字體筆順學習網](http://stroke-order.learningweb.moe.edu.tw)
(經由 [g0v/zh-stroke-data](https://github.com/g0v/zh-stroke-data) 取得)。
該資料著作權為中華民國教育部所有,供筆順教學利用,**不得用於商業用途**,
不適用本專案其餘部分的 MIT 授權。重新產生:`node tools/fetch-bopomofo-strokes.mjs`
