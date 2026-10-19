import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI();

async function analyze(filePath) {
  const buf = fs.readFileSync(filePath);
  // Check if JFIF
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
  const mime = isJpg ? 'image/jpeg' : 'image/png';
  console.log(`Analyzing ${filePath} (${mime}, ${buf.length} bytes)...`);
  
  const res = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mime,
              data: buf.toString('base64')
            }
          },
          {
            text: 'Carefully describe this UI screenshot. What screen is this? Transcribe all text, labels, headers, cards, buttons, fields, values, metrics, and layout in detail. Especially note any project details or "ver proyecto completo" or fields shown.'
          }
        ]
      }
    ]
  });
  return res.text;
}

async function main() {
  const f1 = '.aistudio/artifacts/brain/76c3dcc9-bc6c-4466-a928-57a0865a56f2/.tempmediaStorage/media_1792313819899_f370a915.jpg';
  const f2 = '.aistudio/artifacts/brain/76c3dcc9-bc6c-4466-a928-57a0865a56f2/.tempmediaStorage/media_1792313842560_0145dcde.jpg';
  const img = 'image.png';

  const out1 = await analyze(f1);
  fs.writeFileSync('desc_media1.txt', out1);
  console.log('Saved desc_media1.txt');

  const out2 = await analyze(f2);
  fs.writeFileSync('desc_media2.txt', out2);
  console.log('Saved desc_media2.txt');

  const outImg = await analyze(img);
  fs.writeFileSync('desc_image.txt', outImg);
  console.log('Saved desc_image.txt');
}

main().catch(console.error);
