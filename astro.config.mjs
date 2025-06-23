import { defineConfig } from "astro/config";

export default defineConfig({
  compressHTML: false, // Отключает минификацию HTML
  trailingSlash: "never",
  output: "static",
  build: {
    outDir: 'dist',
    format: "file",
    assetsPrefix: "./",
    client: './client',
    inlineStylesheets: 'never',
    assetsDir: 'assets'
  },
  vite: {

    build: {
      cssCodeSplit: true, // Отключает разбитие CSS
      minify: false, // Отключает минификацию в CSS и JS
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
          assetFileNames: (chunkInfo) => {
             
            if (chunkInfo.type === 'asset' && chunkInfo.name.endsWith('.css')) {
            console.log(chunkInfo);
              
              return `css/index.css`;
            }
            return chunkInfo.name;
          },
        },
      },
    },
  },
});
