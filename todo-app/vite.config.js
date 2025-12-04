import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Day-03-JavaScript/todo-app/',   // 👈 very important for GitHub Pages
  plugins: [react()],
})
