import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VectorStoreService } from './vector-store.service';
import { loadCisDocumentsFromFile } from './utils/document-loader.util';

@Injectable()
export class CisInitService implements OnModuleInit {
  private readonly logger = new Logger(CisInitService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly vectorStoreService: VectorStoreService,
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

      const exists = await this.vectorStoreService.collectionExists(collectionName);
      if (exists) {
        this.logger.log(`ℹ️ Vector collection '${collectionName}' already exists. Skipping indexing.`);
        return;
      }

      const documents = await loadCisDocumentsFromFile(resolvedCisDocPath);
      await this.vectorStoreService.indexDocuments(documents, collectionName);

      this.logger.log(`✅ CIS '${cisName}' initialized. Vector collection: '${collectionName}'`);
    } catch (error) {
      this.logger.error(`❌ CIS initialization failed: ${(error as Error).message}`, error);
    }
  }
}
