const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcssPresetEnv = require("postcss-preset-env");

const config = {
  plugins: [
    autoprefixer(),
    postcssPresetEnv({ stage: 1 }),
    cssnano({ preset: "default" }),
  ],
};

module.exports = config;
