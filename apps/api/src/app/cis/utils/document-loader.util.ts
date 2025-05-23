import * as fs from 'fs/promises';
import * as path from 'path';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

export async function loadCisDocumentsFromFile(filePath: string): Promise<Document[]> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf': {
      const loader = new PDFLoader(filePath);
      return await loader.load();
    }

    case '.md':
    case '.txt': {
      const loader = new TextLoader(filePath);
      return await loader.load();
    }

    default:
      throw new Error(`Unsupported file extension: ${ext}`);
  }
}
