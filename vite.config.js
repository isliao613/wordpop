import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 必須和 GitHub repo 名稱一致(https://帳號.github.io/wordpop/)
// 如果你的 repo 不叫 wordpop,請改這裡
export default defineConfig({
  plugins: [react()],
  base: '/wordpop/',
  build: {
    rollupOptions: {
      output: {
        // React 幾乎不會變,拆出來單獨快取:之後每次改遊戲重新部署,
        // 回訪的人只要下載應用程式那塊,React 那塊靠 Service Worker 的舊快取就好
        manualChunks: { react: ['react', 'react-dom'] },
      },
    },
  },
  define: {
    // 建置當天日期(每次部署自動戳上,顯示在版號旁)
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleDateString('sv', { timeZone: 'Asia/Taipei' }).replace(/-/g, '.')
    ),
  },
})
