import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Day-03-JavaScript/todo-app/',
  plugins: [react()],
})
