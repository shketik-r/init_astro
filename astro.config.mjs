import { defineConfig } from "astro/config"
import { viteStaticCopy } from 'vite-plugin-static-copy'
import sass from 'sass'
import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'

function scssWatcher() {
  return {
    name: 'scss-watcher',
    configureServer(server) {
      const compileFile = (filePath) => {
        try {
          const result = sass.compile(filePath, {
            style: 'expanded',
            loadPaths: [path.dirname(filePath)]
          })

          const relativePath = path.relative('src/assets/styles/page', filePath)
          const destPath = path.join(
            'public/css',
            relativePath.replace(/\.(scss|sass)$/, '.css')
          )

          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true })
          }
          
          fs.writeFileSync(destPath, result.css)
          console.log(`✅ Compiled: ${filePath} → ${destPath}`)
        } catch (error) {
          console.error(`❌ Failed to compile ${filePath}:`, error.message)
        }
      }

      const watcher = chokidar.watch('src/assets/styles/page/**/*.{scss,sass}', {
        ignoreInitial: false,
        persistent: true,
        usePolling: true // Для лучшей совместимости в некоторых средах
      })

      watcher
        .on('add', compileFile)
        .on('change', compileFile)
        .on('unlink', (filePath) => {
          const cssFile = path.join(
            'public/css',
            path.relative('src/assets/styles/page', filePath)
              .replace(/\.(scss|sass)$/, '.css')
          )
          try {
            fs.unlinkSync(cssFile)
            console.log(`🗑️ Removed: ${cssFile}`)
          } catch (err) {
            if (err.code !== 'ENOENT') console.error(err)
          }
        })

      server.httpServer?.once('close', () => {
        watcher.close()
        console.log('👋 SCSS watcher stopped')
      })

      console.log('👀 SCSS watcher started')
    }
  }
}

export default defineConfig({
  devToolbar: { enabled: false },
  output: 'static',
  build: {
    outDir: 'dist',
    assetsPrefix: './'
  },
  vite: {
    plugins: [
      scssWatcher(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/styles/page/**/*.{scss,sass}',
            dest: 'css',
            rename: (name) => name.replace(/\.(scss|sass)$/, '.css'),
            transform: (content, srcPath) => {
              try {
                const result = sass.compileString(content.toString(), {
                  style: 'compressed',
                  loadPaths: [path.dirname(srcPath)]
                })
                return result.css
              } catch (error) {
                console.error(`Build error for ${srcPath}:`, error.message)
                return ''
              }
            }
          }
        ],
        hook: 'buildStart'
      })
    ],
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/css/[name][extname]'
            }
            return 'assets/[name][extname]'
          }
        }
      }
    }
  }
})
