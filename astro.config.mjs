import { defineConfig } from 'astro/config';

export default defineConfig({
    devToolbar: { enabled: false },
    compressHTML: false,
    output: 'static',

    build: {
        format: "file",
        assetsPrefix: "./",
    },

    vite: {
        build: {
            cssCodeSplit: false,
            inlineStylesheets: 'never',
            minify: false,
            assetsInlineLimit: 0,
            polyfill: false,
            rollupOptions: {
                output: {
                    // Оставляем только красивую сортировку для CSS стилей
                    assetFileNames: (chunkInfo) => {
                        if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
                            return 'css/[name][extname]';
                        }
                        return 'assets/[name][extname]';
                    },
                },
            },
        },
    },
});
