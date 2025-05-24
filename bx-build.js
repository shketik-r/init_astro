import fs from "fs-extra";

const srcDir = "dist";
const destDir = "../";

async function copyFiles(source, destination) {
  try {
    await fs.copy(source, destination);
  } catch (err) {
    console.error("Ошибка при копировании файлов:", err);
  }
}

copyFiles(srcDir, destDir);
