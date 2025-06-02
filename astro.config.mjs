import { defineConfig } from 'astro/config';

export default defineConfig({
  compressHTML: false,
  trailingSlash: "never",
  output: 'static',
  build: {
    outDir: 'dist',
    format: "file",
    assetsPrefix: "./",
  },
  vite: {
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
});
