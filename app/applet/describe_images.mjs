import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI();

async function run() {
  const files = [
    { path: 'image.png', mime: 'image/png' },
    { path: 'zz.png', mime: 'image/png' },
    { path: '.aistudio/artifacts/brain/76c3dcc9-bc6c-4466-a928-57a0865a56f2/.tempmediaStorage/media_1792313819899_f370a915.jpg', mime: 'image/jpeg' },
    { path: '.aistudio/artifacts/brain/76c3dcc9-bc6c-4466-a928-57a0865a56f2/.tempmediaStorage/media_1792313842560_0145dcde.jpg', mime: 'image/jpeg' }
  ];

  for (const item of files) {
    if (!fs.existsSync(item.path)) {
      console.log('File not found:', item.path);
      continue;
    }
    try {
      console.log('Analyzing:', item.path);
      const buf = fs.readFileSync(item.path);
      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: item.mime,
                  data: buf.toString('base64')
                }
              },
              {
                text: 'Detail everything visible in this screenshot: all text, labels, sections, buttons, icons, modals, and colors. Transcribe carefully.'
              }
            ]
          }
        ]
      });
      console.log('=== RESULT FOR ' + item.path + ' ===');
      console.log(res.text);
    } catch (e) {
      console.error('Error for ' + item.path + ':', e.message);
    }
  }
}

run();
