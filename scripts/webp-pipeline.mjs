#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const FILE_EXTENSIONS_TO_CONVERT = new Set(['.jpg', '.jpeg', '.png']);
const TEXT_EXTENSIONS_TO_SCAN = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.xml',
  '.html',
  '.txt',
  '.webmanifest'
]);
const IGNORE_DIRS = new Set(['node_modules', '.git', '.vite', 'dist', 'NudeNet-3']);
const LOCAL_IMAGE_PATH_PATTERN = /(?<!https?:)([\\/]*images[\\/][^"'`]+?)\.(jpg|jpeg|png)\b/gi;

function normalizeSlashes(inputPath) {
  return inputPath.replace(/\\/g, '/');
}

function listFilesRecursively(startDir, collector = []) {
  if (!fs.existsSync(startDir)) {
    return collector;
  }

  const entries = fs.readdirSync(startDir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      listFilesRecursively(absolutePath, collector);
      continue;
    }
    collector.push(absolutePath);
  }

  return collector;
}

function listTextFilesToScan(startDir, collector = []) {
  if (!fs.existsSync(startDir)) {
    return collector;
  }

  const entries = fs.readdirSync(startDir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      listTextFilesToScan(absolutePath, collector);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (TEXT_EXTENSIONS_TO_SCAN.has(extension)) {
      collector.push(absolutePath);
    }
  }

  return collector;
}

async function convertImagesToWebp() {
  const allImageFiles = listFilesRecursively(IMAGES_DIR).filter((filePath) =>
    FILE_EXTENSIONS_TO_CONVERT.has(path.extname(filePath).toLowerCase())
  );

  let convertedCount = 0;
  let skippedCount = 0;
  let deletedSourceCount = 0;

  for (const sourcePath of allImageFiles) {
    const directory = path.dirname(sourcePath);
    const baseName = path.basename(sourcePath, path.extname(sourcePath));
    const targetPath = path.join(directory, `${baseName}.webp`);

    if (fs.existsSync(targetPath)) {
      skippedCount += 1;
      if (sourcePath !== targetPath) {
        fs.unlinkSync(sourcePath);
        deletedSourceCount += 1;
      }
      continue;
    }

    await sharp(sourcePath)
      .rotate()
      .webp({ quality: 82, effort: 6 })
      .toFile(targetPath);

    convertedCount += 1;
    fs.unlinkSync(sourcePath);
    deletedSourceCount += 1;
  }

  return { convertedCount, skippedCount, deletedSourceCount };
}

function rewriteLocalImageReferences() {
  const files = listTextFilesToScan(ROOT_DIR);
  let updatedFilesCount = 0;
  let updatedReferencesCount = 0;

  for (const filePath of files) {
    const rawContent = fs.readFileSync(filePath, 'utf8');
    let localReplacements = 0;

    const updatedContent = rawContent.replace(LOCAL_IMAGE_PATH_PATTERN, (full, basePath, extension) => {
      const normalizedBasePath = normalizeSlashes(basePath);
      const normalizedExt = extension.toLowerCase();
      const hasLeadingSlash = normalizedBasePath.startsWith('/');
      const hasImagesSegment =
        normalizedBasePath.startsWith('images/') || normalizedBasePath.startsWith('/images/');

      if (!hasImagesSegment || normalizedExt === 'webp') {
        return full;
      }

      localReplacements += 1;
      const nextPath = `${normalizedBasePath}.webp`;
      return hasLeadingSlash ? nextPath : `/${nextPath}`;
    });

    if (localReplacements > 0 && updatedContent !== rawContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      updatedFilesCount += 1;
      updatedReferencesCount += localReplacements;
    }
  }

  return { updatedFilesCount, updatedReferencesCount };
}

async function main() {
  console.log('Starting WEBP pipeline...');
  console.log(`Images directory: ${IMAGES_DIR}`);

  const conversionResult = await convertImagesToWebp();
  const rewriteResult = rewriteLocalImageReferences();

  console.log(`Converted images: ${conversionResult.convertedCount}`);
  console.log(`Skipped (already WEBP): ${conversionResult.skippedCount}`);
  console.log(`Deleted source files: ${conversionResult.deletedSourceCount}`);
  console.log(`Updated files with WEBP references: ${rewriteResult.updatedFilesCount}`);
  console.log(`Updated image references: ${rewriteResult.updatedReferencesCount}`);
  console.log('WEBP pipeline completed.');
}

main().catch((error) => {
  console.error('WEBP pipeline failed:', error);
  process.exit(1);
});
