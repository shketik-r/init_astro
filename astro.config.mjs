import { defineConfig } from 'astro/config';
import viteSass from 'vite-plugin-sass';

export default defineConfig({
  // Базовые настройки Astro
  devToolbar: { enabled: false },
  // Отключает минификацию HTML
  compressHTML: false,
  output: 'static',
  build: {
    format: "file",
    assetsPrefix: "./",
  },

  // Vite конфигурация
  vite: {
    // plugins: [viteSass()],
    server: {
      // hmr: {
      //   port: 4323, // или другой порт, на котором слушает Astro
      //   host: 'localhost',
      // },
      // watch: {
      //   // отслеживать изменения в папке с CSS
      //   paths: ['assets/styles/**/*.scss', 'assets/styles/**/*.css'],
      // },
    },
    build: {
      cssCodeSplit: true,       // Включаем разбиение CSS на отдельные файлы
      inlineStylesheets: 'never',
      minify: false,
      assetsInlineLimit: 0,
      polyfill: false,
      rollupOptions: {
        output: {
          entryFileNames: (chunkInfo) => {
            const scriptFiles = chunkInfo.moduleIds.filter(path => {
              const segments = path.split('/');
              const scriptIndex = segments.indexOf('scripts');
              return scriptIndex !== -1 && segments.length === scriptIndex + 2;
            });
            const scriptFileNamesInRoot = scriptFiles.map(filePath => filePath.split('/').pop().split('\\').pop());
            return `js/${scriptFileNamesInRoot[0]}`; // Оригинальные имена для скриптов
          },
          assetFileNames: (chunkInfo) => {
            console.log(chunkInfo.originalFileName);

            if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
              return 'css/[name][extname]';  // Оригинальные имена для файлов css
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  },

  // Настройки Markdown
  markdown: {
    syntaxHighlight: 'prism',
    shikiConfig: {
      theme: 'github-dark'
    }
  }
})
