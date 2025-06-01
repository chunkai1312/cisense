import * as path from 'path';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

export async function loadDocumentsFromFile(filePath: string): Promise<Document[]> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.pdf':
      return await new PDFLoader(filePath).load();
    case '.md':
    case '.txt':
      return await new TextLoader(filePath).load();
    default:
      throw new Error(`Unsupported file extension: ${ext}`);
  }
}