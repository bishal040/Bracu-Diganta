const Jimp = require('jimp');
const fs = require('fs');

async function processImage(imagePath) {
  try {
    const image = await Jimp.read(imagePath);
    
    // Replace near-white pixels with transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If color is very close to white, make it transparent
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel
      }
    });

    await image.writeAsync(imagePath);
    console.log(`Successfully processed ${imagePath}`);
  } catch (err) {
    console.error(`Error processing ${imagePath}:`, err);
  }
}

async function run() {
  await processImage('public/Diganta Logo.png');
  await processImage('public/Lasset Logo.png');
  await processImage('public/Bracu Logo.png');
}

run();
