

import fs from 'node:fs';
import path from 'node:path';

const [, , inputPathArg, outputDirArg, chunkSizeArg] = process.argv;

if (!inputPathArg) {
    console.error('Usage: node split-data.mjs path/to/bukhari.json [outputDir] [chunkSize]');
    process.exit(1);
}

const inputPath = path.resolve(inputPathArg);
const outputDir = path.resolve(outputDirArg || 'data');
const chunkSize = parseInt(chunkSizeArg || '150', 10);

if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
}

console.log(`Reading ${inputPath} ...`);
const raw = fs.readFileSync(inputPath, 'utf8');

let data;
try {
    data = JSON.parse(raw);
} catch (err) {
    console.error('Could not parse JSON:', err.message);
    process.exit(1);
}

const hadiths =
    data.hadiths || data.items || (Array.isArray(data) ? data : null);

if (!hadiths) {
    console.error(
        'Could not find a hadiths array in the file (expected data.hadiths, data.items, or a top-level array).'
    );
    process.exit(1);
}

const chapters = Array.isArray(data.chapters) ? data.chapters : [];

fs.mkdirSync(outputDir, { recursive: true });

// --- Build the lightweight index (id + chapterId only) -----------------
const index = hadiths.map((h) => ({
    id: h.id ?? h.number ?? h.hadithNumber ?? null,
    chapterId: h.chapterId ?? h.bookId ?? h.chapter ?? 1,
}));

// --- Split hadiths into fixed-size chunks, preserving original order ---
const chunkCount = Math.ceil(hadiths.length / chunkSize);
const chunkFiles = [];

for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, hadiths.length);
    const chunkHadiths = hadiths.slice(start, end);

    const fileName = `chunk-${i}.json`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify({ hadiths: chunkHadiths }));

    const sizeKB = (fs.statSync(filePath).size / 1024).toFixed(1);
    chunkFiles.push({ file: fileName, count: chunkHadiths.length, sizeKB });
}

// --- Write meta.json -----------------------------------------------------
const meta = {
    chapters,
    index,
    chunkSize,
    chunkCount,
    totalHadiths: hadiths.length,
};

const metaPath = path.join(outputDir, 'meta.json');
fs.writeFileSync(metaPath, JSON.stringify(meta));

// --- Summary ---------------------------------------------------------------
const metaSizeKB = (fs.statSync(metaPath).size / 1024).toFixed(1);
const totalChunksSizeKB = chunkFiles.reduce((sum, c) => sum + parseFloat(c.sizeKB), 0);

console.log('\nDone!\n');
console.log(`  Output directory : ${outputDir}`);
console.log(`  Chapters         : ${chapters.length}`);
console.log(`  Hadiths          : ${hadiths.length}`);
console.log(`  Chunk size       : ${chunkSize} hadiths/file`);
console.log(`  Chunks written   : ${chunkCount}`);
console.log(`  meta.json size   : ${metaSizeKB} KB  (loads first, instantly)`);
console.log(`  chunk-0.json size: ${chunkFiles[0]?.sizeKB} KB  (loads second, shows real content)`);
console.log(`  All chunks total : ${totalChunksSizeKB.toFixed(1)} KB (streamed quietly in the background)`);
console.log('\nNext steps:');
console.log(`  1. Upload the "${path.basename(outputDir)}" folder next to index.html on your host.`);
console.log('  2. Make sure the updated script.js (which fetches data/meta.json + data/chunk-N.json) is deployed.');
console.log('  3. You can delete the old single bukhari.json from the server once this is live.');
