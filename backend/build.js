const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Get all TypeScript files from src directory
function getAllTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllTsFiles(fullPath, files);
    } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const entryPoints = getAllTsFiles('./src');

esbuild.buildSync({
  entryPoints,
  bundle: false,
  platform: 'node',
  target: 'node18',
  outdir: './dist',
  format: 'cjs',
  sourcemap: true,
});

console.log('✅ Build completed successfully!');
