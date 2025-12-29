import { copyFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '..', 'dist');
const indexHtml = join(distPath, 'index.html');
const notFoundHtml = join(distPath, '404.html');

try {
  copyFileSync(indexHtml, notFoundHtml);
  console.log('✓ Copied index.html to 404.html for GitHub Pages');
} catch (error) {
  console.error('✗ Failed to copy 404.html:', error.message);
  process.exit(1);
}

