import { Jimp } from 'jimp';
import pngToIco from 'png-to-ico';
import fs from 'fs';

async function convert() {
  try {
    const image = await Jimp.read('public/logo.png');
    image.resize({ w: 256, h: 256 });
    const buffer = await image.getBuffer('image/png');
    
    const icoBuffer = await pngToIco(buffer);
    fs.writeFileSync('icon.ico', icoBuffer);
    console.log('Icon created successfully');
  } catch (error) {
    console.error(error);
  }
}

convert();
