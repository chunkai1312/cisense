import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantVectorStore } from '../langchain/vectorstores/qdrant.vectorstore';
import { loadDocumentsFromFile } from '../langchain/loaders/document.loader';

@Injectable()
export class CisInitService implements OnModuleInit {
  private readonly logger = new Logger(CisInitService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly qdrantVectorStore: QdrantVectorStore,
  ) {}

  async onModuleInit(): Promise<void> {
    const cisName = this.configService.get<string>('CIS_NAME');
    const cisImgPath = this.configService.get<string>('CIS_IMG_PATH');
    const cisDocPath = this.configService.get<string>('CIS_DOC_PATH');

    if (!cisName || !cisImgPath || !cisDocPath) {
      this.logger.warn(`❗ Missing 'CIS_NAME', 'CIS_IMG_PATH' or 'CIS_DOC_PATH'. Skipping CIS initialization.`);
      return;
    }

    this.logger.log(`🔧 Initializing CIS: ${cisName}`);
    const collectionName = cisName;

    try {
      const resolvedCisImgPath = path.resolve(process.cwd(), cisImgPath);
      const resolvedCisDocPath = path.resolve(process.cwd(), cisDocPath);

      await fs.access(resolvedCisImgPath);
      await fs.access(resolvedCisDocPath);

      this.logger.log(`🖼️ Checking CIS logo image at: ${resolvedCisImgPath}`);
      this.logger.log(`📄 Loading CIS document from: ${resolvedCisDocPath}`);

      const exists = await this.qdrantVectorStore.collectionExists(collectionName);
      if (exists) {
        this.logger.log(`ℹ️ Vector collection '${collectionName}' already exists. Skipping indexing.`);
        return;
      }

      const documents = await loadDocumentsFromFile(resolvedCisDocPath);
      await this.qdrantVectorStore.indexDocuments(documents, collectionName);

      this.logger.log(`✅ CIS '${cisName}' initialized. Vector collection: '${collectionName}'`);
    } catch (error) {
      this.logger.error(`❌ CIS initialization failed: ${(error as Error).message}`, error);
    }
  }
}
