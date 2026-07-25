/**
 * Восстанавливает бинарные ассеты (обложки игр, баннеры) из base64-файлов.
 *
 * Зачем: код заливался в GitHub через API, который принимает только текст,
 * поэтому изображения хранятся в репозитории как assets-b64/**\/*.b64
 * и декодируются в public/ автоматически (postinstall / prebuild / predev).
 *
 * Локально и на Vercel ничего запускать вручную не нужно.
 * TODO(providers): при подключении реального игрового провайдера обложки
 * будут приходить с его CDN — тогда assets-b64/ и этот скрипт удаляются.
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "assets-b64");
const outRoot = join(root, "public");

if (!existsSync(srcDir)) {
  console.log("[assets] assets-b64/ not found — nothing to decode");
  process.exit(0);
}

let written = 0;
let skipped = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith(".b64")) continue;

    const rel = relative(srcDir, full).replace(/\.b64$/, "");
    const out = join(outRoot, rel);
    const buf = Buffer.from(readFileSync(full, "utf8"), "base64");

    // пропускаем, если файл уже на месте и не изменился
    if (existsSync(out) && statSync(out).size === buf.length) {
      skipped++;
      continue;
    }
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, buf);
    written++;
  }
}

walk(srcDir);
console.log(`[assets] decoded: ${written}, up-to-date: ${skipped}`);
