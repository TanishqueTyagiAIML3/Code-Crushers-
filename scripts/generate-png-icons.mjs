import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw scanlines
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;
  const safeRadius = width * 0.36; // for maskable icons

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // ShikshaSathi Primary Saffron/Orange Gradient:
      // Top-left: #f97316 (249, 115, 22), Bottom-right: #c2410c (194, 65, 12)
      const gradT = (x + y) / (width + height);
      let r = Math.round(249 * (1 - gradT) + 194 * gradT);
      let g = Math.round(115 * (1 - gradT) + 65 * gradT);
      let b = Math.round(22 * (1 - gradT) + 12 * gradT);
      let a = 255;

      if (!isMaskable) {
        // Rounded corner squircle
        const cornerR = width * 0.22;
        const qx = Math.abs(x - cx) - (cx - cornerR);
        const qy = Math.abs(y - cy) - (cy - cornerR);
        if (qx > 0 && qy > 0) {
          const cornerDist = Math.sqrt(qx * qx + qy * qy);
          if (cornerDist > cornerR) {
            a = 0; // outside rounded rect
          }
        }
      }

      // Draw emblem in center (white open book + mortarboard)
      if (a > 0) {
        // Cap rhombus
        const nx = (x - cx) / (width * 0.38);
        const ny = (y - cy + height * 0.1) / (height * 0.22);
        const rhombus = Math.abs(nx) + Math.abs(ny);

        // Book base
        const bx = Math.abs(x - cx) / (width * 0.3);
        const by = (y - cy - height * 0.16) / (height * 0.16);

        if (rhombus < 0.75 && y < cy) {
          // Mortarboard cap
          r = 255; g = 255; b = 255;
        } else if (by >= 0 && by < 0.6 && bx < 0.8 && Math.abs(x - cx) > 4) {
          // Open book wings
          r = 255; g = 255; b = 255;
        } else if (dist > safeRadius && dist < safeRadius + 6 && Math.abs(dx) > Math.abs(dy) * 0.8) {
          // Acoustic soundwaves / voice AI ring
          r = 254; g = 240; b = 138; // golden accent
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 192x192 standard icon
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));

// 512x512 standard icon
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));

// 512x512 maskable icon (full bleed background for Android dynamic cropping)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));

// apple-touch-icon (180x180)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

// favicon (64x64 PNG)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePng(64, 64, false));

console.log('Successfully generated all PWA compliant PNG icons in public/ directory!');
