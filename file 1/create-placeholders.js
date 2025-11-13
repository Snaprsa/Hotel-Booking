const fs = require('fs');
const path = require('path');

// Create a simple 1x1 transparent PNG as base64
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Create a simple SVG
const simpleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#e5e7eb"/></svg>`;

// List of all required images
const images = {
  'logo.png': transparentPNG,
  'logo-light.png': transparentPNG,
  'clientSayMain.png': transparentPNG,
  'clientSay1.png': transparentPNG,
  'clientSay2.png': transparentPNG,
  'clientSay3.png': transparentPNG,
  'clientSay4.png': transparentPNG,
  'clientSay5.png': transparentPNG,
  'clientSay6.png': transparentPNG,
  'quotation.png': transparentPNG,
  'quotation2.png': transparentPNG,
  'HIW1.png': transparentPNG,
  'HIW2.png': transparentPNG,
  'HIW3.png': transparentPNG,
  'VectorHIW.svg': simpleSVG,
  'BecomeAnAuthorImg.png': transparentPNG,
  'our-features.png': transparentPNG,
  'SVG-subcribe2.png': transparentPNG,
  'ads.png': transparentPNG,
  'Facebook.svg': simpleSVG,
  'Twitter.svg': simpleSVG,
  'Google.svg': simpleSVG,
  'hero-right-car.png': transparentPNG,
  'hero-right2.png': transparentPNG,
  'appSvg1.png': transparentPNG,
  'appSvg2.png': transparentPNG,
  'appRightImgTree.png': transparentPNG,
  'dowloadAppBG.png': transparentPNG,
  'appRightImg.png': transparentPNG,
  'btn-ios.png': transparentPNG,
  'btn-android.png': transparentPNG,
  '404.png': transparentPNG,
  'hero-right-3.png': transparentPNG,
  'travelhero2.png': transparentPNG,
  'hero-right.png': transparentPNG,
  'about-hero-right.png': transparentPNG,
  'vis.png': transparentPNG,
  'mastercard.svg': simpleSVG,
  'HIW2-1.png': transparentPNG,
  'HIW2-2.png': transparentPNG,
  'HIW2-3.png': transparentPNG,
  'HIW2-1-dark.png': transparentPNG,
  'HIW2-2-dark.png': transparentPNG,
  'HIW2-3-dark.png': transparentPNG,
  'our-features-2.png': transparentPNG,
};

// Create subdirectories and their images
const subdirs = {
  'avatars': Array.from({length: 20}, (_, i) => `Image-${i + 1}.png`),
  'cars': Array.from({length: 16}, (_, i) => `${i + 1}.png`),
  'carUtilities': Array.from({length: 8}, (_, i) => `${i + 1}.png`),
  'logos/nomal': ['1.png', '2.png', '3.png', '4.png', '5.png'],
  'logos/dark': ['1.png', '2.png', '3.png', '4.png', '5.png'],
};

const imagesDir = path.join(__dirname, 'src', 'images');

// Create main images
for (const [filename, content] of Object.entries(images)) {
  const filepath = path.join(imagesDir, filename);
  if (typeof content === 'string') {
    fs.writeFileSync(filepath, content);
  } else {
    fs.writeFileSync(filepath, content);
  }
  console.log(`Created: ${filename}`);
}

// Create subdirectory images
for (const [subdir, files] of Object.entries(subdirs)) {
  const subdirPath = path.join(imagesDir, subdir);
  fs.mkdirSync(subdirPath, { recursive: true });

  for (const filename of files) {
    const filepath = path.join(subdirPath, filename);
    fs.writeFileSync(filepath, transparentPNG);
    console.log(`Created: ${subdir}/${filename}`);
  }
}

console.log('\nAll placeholder images created successfully!');
