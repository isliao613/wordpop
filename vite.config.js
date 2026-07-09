import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 必須和 GitHub repo 名稱一致(https://帳號.github.io/wordpop/)
// 如果你的 repo 不叫 wordpop,請改這裡
export default defineConfig({
  plugins: [react()],
  base: '/wordpop/',
})
