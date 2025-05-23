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
    const cisFilePath = this.configService.get<string>('CIS_FILE_PATH');
    const cisLogoPath = this.configService.get<string>('CIS_LOGO_PATH');

    if (!cisName || !cisFilePath || !cisLogoPath) {
      this.logger.warn(`❗ Missing 'CIS_NAME', 'CIS_FILE_PATH' or 'CIS_LOGO_PATH'. Skipping CIS initialization.`);
      return;
    }

    this.logger.log(`🔧 Initializing CIS: ${cisName}`);
    const collectionName = cisName;

    try {
      const resolvedDocPath = path.resolve(process.cwd(), cisFilePath);
      const resolvedLogoPath = path.resolve(process.cwd(), cisLogoPath);

      await fs.access(resolvedDocPath);
      await fs.access(resolvedLogoPath);

      this.logger.log(`📄 Loading CIS document from: ${resolvedDocPath}`);
      this.logger.log(`🖼️  Checking CIS logo image at: ${resolvedLogoPath}`);

      const exists = await this.vectorStoreService.collectionExists(collectionName);
      if (exists) {
        this.logger.log(`ℹ️  Vector collection '${collectionName}' already exists. Skipping indexing.`);
        return;
      }

      const documents = await loadCisDocumentsFromFile(resolvedDocPath);
      await this.vectorStoreService.indexDocuments(documents, collectionName);

      this.logger.log(`✅ CIS '${cisName}' initialized. Vector collection: '${collectionName}'`);
    } catch (error) {
      this.logger.error(`❌ CIS initialization failed: ${(error as Error).message}`, error);
    }
  }
}
