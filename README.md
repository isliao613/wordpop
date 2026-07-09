# WordPop 🎈 英語發音遊戲

## 首次部署(只做一次)

1. 在 GitHub 建立名為 `wordpop` 的 repo(其他名字要同步改 `vite.config.js` 的 base)
2. 本機執行:
   ```bash
   npm install
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/你的帳號/wordpop.git
   git push -u origin main
   ```
3. 到 repo 的 **Settings → Pages → Source** 選 **GitHub Actions**
4. 等 Actions 跑完(約 1 分鐘),網址:`https://你的帳號.github.io/wordpop/`

## 日常開發流程

```bash
npm run dev        # 本機預覽 http://localhost:5173
# 改 src/App.jsx ...
git add . && git commit -m "更新" && git push   # push 即自動部署
```
