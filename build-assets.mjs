import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const scriptsSourceDir = 'src/assets/scripts';
const stylesSourceDir = 'src/assets/styles';

// ---  СБОРКА СКРИПТОВ (JS) ---
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



// ---  СБОРКА СТИЛЕЙ (CSS) ---
// Функция для рекурсивного поиска всех CSS/SCSS файлов
const getAllCssFiles = (dirPath, arrayOfFiles = []) => {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllCssFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.css') || file.endsWith('.scss')) {
            // Игнорируем partial-файлы Sass (начинающиеся с подчеркивания, например, _variables.scss)
            if (!file.startsWith('_')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
};

const allCssFiles = getAllCssFiles(stylesSourceDir);
const cssEntryPoints = {};

allCssFiles.forEach(filePath => {
    // Получаем относительный путь от папки исходников
    const relativePath = path.relative(stylesSourceDir, filePath);
    
    // Формируем имя точки входа без расширения
    const entryName = path.join(path.dirname(relativePath), path.parse(filePath).name)
        .replace(/\\/g, '/'); // Нормализуем слэши для Windows
        
    cssEntryPoints[entryName] = filePath;
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
                    assetFileNames: '[name].[ext]'
                }
            }
        }
    });
}


console.log(' Все скрипты (js/) и стили (css/) успешно собраны!');
