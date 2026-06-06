const Jimp = require('jimp');

async function cropTop() {
  try {
    const image = await Jimp.read('public/Diganta Logo.png');
    const cropHeight = Math.floor(image.bitmap.height * 0.3);
    const newHeight = image.bitmap.height - cropHeight;
    image.crop(0, cropHeight, image.bitmap.width, newHeight);
    await image.writeAsync('public/Diganta Logo.png');
    console.log('Successfully cropped top 30% of Diganta Logo');
  } catch (error) {
    console.error('Failed to crop logo:', error);
  }
}
cropTop();
