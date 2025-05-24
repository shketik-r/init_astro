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
        // Названия без хэшей
        output: {
          entryFileNames: "js/[name].js",
          // assetFileNames: "[ext]/[name][extname]",
          assetFileNames: (chunkInfo) => {
            const nameArr = chunkInfo.name.split(".");
            const isStyle = nameArr[nameArr.length - 1] === "css";

            if (isStyle) {
              return "[ext]/[name][extname]";
            } else {
              return "convertImg/[name][extname]";
            }
          },
        },
      },
    },
  },
});
