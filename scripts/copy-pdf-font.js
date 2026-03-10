const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'dejavu-fonts-ttf', 'ttf', 'DejaVuSans.ttf');
const destDir = path.join(__dirname, '..', 'public', 'fonts');
const dest = path.join(destDir, 'DejaVuSans.ttf');

if (fs.existsSync(src)) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('Copied DejaVuSans.ttf to public/fonts');
} else {
  console.warn('DejaVuSans.ttf not found in node_modules, run npm install dejavu-fonts-ttf');
}
