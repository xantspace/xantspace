import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Runs the api/*.js endpoints inside `npm run dev`, the same way Vercel runs them in production.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\//, '')
        const file = resolve('api', `${name}.js`)
        if (!/^[a-z]+$/.test(name) || !existsSync(file)) return next()
        try {
          const mod = await server.ssrLoadModule(file)
          await mod.default(req, res)
        } catch (err) {
          next(err)
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Make .env.local values (PAYSTACK_SECRET_KEY etc.) available to the api/ code.
  // Only VITE_-prefixed values ever reach the browser, so these stay server-side.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [react(), tailwindcss(), localApi()],
  }
})
