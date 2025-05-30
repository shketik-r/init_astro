import { defineConfig, squooshImageService } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Отключает минификацию HTML
  compressHTML: false,
  trailingSlash: "never",
  build: {
    format: "file",
    assets: "./convertImg",
    assetsPrefix: "./",
  },
  image: {
    service: squooshImageService(),
  },
  vite: {
    build: {
      // Отключает разбитие CSS
      cssCodeSplit: false,
      // Отключает минификацию в CSS и JS
      minify: false,
      // Минимальный размер инлайна CSS и JS
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          entryFileNames: (chunkInfo) => {
            console.log(chunkInfo);
            
            // const scriptFiles = chunkInfo.moduleIds.filter(path => {
            //   const segments = path.split('/');
            //   const scriptIndex = segments.indexOf('scripts');
            //   return scriptIndex !== -1 && segments.length === scriptIndex + 2;
            // });
            // const scriptFileNamesInRoot = scriptFiles.map(filePath => filePath.split('/').pop().split('\\').pop());
            // return `js/${scriptFileNamesInRoot[0]}`; // Сохраняем оригинальное имя файла
          },

          assetFileNames: (chunkInfo) => {
            const nameArr = chunkInfo.name.split(".");
            const isStyle = nameArr[nameArr.length - 1] === "css";

            if (isStyle) {
              return "[ext]/[name][extname]";
            } else {
              return "[ext]/[name][extname]";
            }
          },
        },
      },
    },
  },
});
