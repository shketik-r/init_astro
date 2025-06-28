import { defineConfig } from 'astro/config';

export default defineConfig({
  // Отключаем панель инструментов разработчика (Dev Toolbar) в режиме разработки
  devToolbar: { enabled: false },

  // Отключаем минификацию HTML при сборке — итоговый HTML будет читабельным
  compressHTML: false,

  // Указываем режим вывода — статический сайт (без SSR)
  output: 'static',

  build: {
    // Формат сборки — каждый файл отдельно
    format: "file",
    // Префикс для путей к ассетам — относительный путь (важно для корректной работы на разных хостингах)
    assetsPrefix: "./",
  },

  vite: {
    build: {
      // Отключаем разбиение CSS на отдельные чанки — все CSS в один файл
      cssCodeSplit: false,

      // Не инлайнить стили в JS (всегда отдельные CSS-файлы)
      inlineStylesheets: 'never',

      // Отключаем минификацию JS и CSS
      minify: false,

      // Запрещаем инлайнить ассеты (картинки, шрифты) в base64
      assetsInlineLimit: 0,

      // Отключаем добавление полифиллов (например, для старых браузеров)
      polyfill: false,

      rollupOptions: {
        output: {
          // Настройка имен для JS файлов
          entryFileNames: (chunkInfo) => {
            const scriptFiles = chunkInfo.moduleIds.filter(path => {
              const segments = path.split('/');
              const scriptIndex = segments.indexOf('scripts');
              return scriptIndex !== -1 && segments.length === scriptIndex + 2;
            });
            const scriptFileNamesInRoot = scriptFiles.map(filePath =>
              filePath.split('/').pop().split('\\').pop()
            );

            // Возвращаем имя файла для сборки — кладем в папку js/ с оригинальным именем
            return `js/${scriptFileNamesInRoot[0]}`;
          },

          // Настройка имен для ассетов (CSS, изображения и т.д.)
          assetFileNames: (chunkInfo) => {
            console.log(chunkInfo.originalFileName);
            if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
              return 'css/[name][extname]';
            }
            return 'assets/[name][extname]';
          },
        },
      },
    },
  },
})
