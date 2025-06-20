import { defineConfig } from "astro/config";



export default defineConfig({
  devToolbar: {
    enabled: false
  },
  css: {
    modules: false,
  },
  // Отключает разбитие CSS
  cssCodeSplit: true,
  // Отключает минификацию HTML
  compressHTML: false,
  trailingSlash: "never",
  output: 'static',
  build: {
    outDir: 'dist',
    format: "file",
    assetsPrefix: "./",
    styles: {
      include: ['src/styles/blog.scss'],
      dest: 'dist/styles',
    },

  },
  vite: {
    build: {
      // Отключает разбитие CSS
      cssCodeSplit: true,
      // Отключает минификацию в CSS и JS
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
            return `js/${scriptFileNamesInRoot[0]}`;
          },
          assetFileNames: (chunkInfo) => {
            if (chunkInfo.type === 'asset' && chunkInfo.name.endsWith('.css')) {
              return `css/${chunkInfo.name.split('/').pop()}`; // сохраняем оригинальное имя в папке css
            }
            return chunkInfo.name;
          }
        },
      },

    },
  },
});