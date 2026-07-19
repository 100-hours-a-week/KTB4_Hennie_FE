import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import babelConfig from './babel.config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel(babelConfig)],
})
