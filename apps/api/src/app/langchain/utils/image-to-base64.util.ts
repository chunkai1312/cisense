import * as fs from 'fs/promises';
import * as path from 'path';

export async function convertImageToBase64WithMime(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  let mimeType: string;

  switch (ext) {
    case '.png':
      mimeType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      mimeType = 'image/jpeg';
      break;
    case '.webp':
      mimeType = 'image/webp';
      break;
    case '.gif':
      mimeType = 'image/gif';
      break;
    case '.svg':
      mimeType = 'image/svg+xml';
      break;
    default:
      throw new Error(`Unsupported image extension: ${ext}`);
  }

  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}