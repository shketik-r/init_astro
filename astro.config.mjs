import { defineConfig } from "astro/config";



export default defineConfig({
  devToolbar: {
    enabled: false
  },
  // Отключает разбитие CSS
  cssCodeSplit: false,
  // Отключает минификацию HTML
  compressHTML: false,
  trailingSlash: "never",

  build: {
    format: "file",
    assetsPrefix: "./",
  },
  vite: {
    build: {
      minify: false,
      assetsInlineLimit: 0,
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
          assetFileNames: 'css/[name][extname]', // Можно оставить простой шаблон
        },
      },

    },
  },
});