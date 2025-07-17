const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'public/images/gallery');
const images = fs.readdirSync(galleryDir)
  .filter(name => /\.(jpe?g|png)$/i.test(name))
  .map(name => ({
    src: `/images/gallery/${name}`,
    alt: 'image',
    orientation: name.includes('vertical') ? 'vertical' : 'horizontal',
  }));
const outputDir = path.join(process.cwd(), 'src/resources/data');
if (!fs.existsSync(outputDir)) {
fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(
  path.join(process.cwd(), 'src/resources/data/gallery.json'),
  JSON.stringify(images, null, 2)
);

console.log('Gallery manifest generated!');
