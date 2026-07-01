import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const scriptsSourceDir = 'src/assets/scripts';
const stylesSourceDir = 'src/assets/styles';

// --- 1. СБОРКА СКРИПТОВ (JS) ---
const jsFiles = fs.existsSync(scriptsSourceDir) ? fs.readdirSync(scriptsSourceDir) : [];
const jsEntryPoints = {};

jsFiles.forEach(file => {
    if (file.endsWith('.js')) {
        const name = path.parse(file).name;
        jsEntryPoints[name] = path.join(scriptsSourceDir, file);
    }
});

if (Object.keys(jsEntryPoints).length > 0) {
    await build({
        configFile: false,
        publicDir: false,
        plugins: [
            {
                name: 'remove-region-comments',
                renderChunk(code) {
                    const cleanCode = code.replace(/\/\/#region.*[\r\n]*/g, '').replace(/\/\/#endregion.*[\r\n]*/g, '');
                    return { code: cleanCode, map: null };
                }
            }
        ],
        build: {
            minify: false,
            outDir: 'dist/js',
            emptyOutDir: false,
            // 1. Возвращаем поддерживаемый модульный формат 'es'
            lib: {
                entry: jsEntryPoints,
                formats: ['es'],
                fileName: (format, entryName) => `${entryName}.js`
            },
            rollupOptions: {
                output: {
                    // 2. ГЛАВНАЯ НАСТРОЙКА: Полностью отключаем автоматическое создание общих чанков (кусков кода)
                    // Заставляем Vite вставлять импортируемый код прямо внутрь index.js и global.js
                    manualChunks: () => null
                }
            }
        }
    });
}



// --- 2. СБОРКА СТИЛЕЙ (CSS) ---
const cssFiles = fs.existsSync(stylesSourceDir) ? fs.readdirSync(stylesSourceDir) : [];
const cssEntryPoints = {};

cssFiles.forEach(file => {
    if (file.endsWith('.css') || file.endsWith('.scss')) { // Поддерживает и чистый CSS, и SCSS
        const name = path.parse(file).name;
        cssEntryPoints[name] = path.join(stylesSourceDir, file);
    }
});

if (Object.keys(cssEntryPoints).length > 0) {
    await build({
        configFile: false,
        publicDir: false,
        build: {
            minify: false,
            outDir: 'dist/css',
            emptyOutDir: false,
            rollupOptions: {
                input: cssEntryPoints,
                output: {
                    // Задаем жесткое имя для CSS файлов без хэшей
                    assetFileNames: '[name].[ext]'
                }
            }
        }
    });
}

console.log(' Все скрипты (js/) и стили (css/) успешно собраны!');
