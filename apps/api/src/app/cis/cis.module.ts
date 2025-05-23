import { Module } from '@nestjs/common';
import { CisInitService } from './cis-init.service';
import { VectorStoreService } from './vector-store.service';

@Module({
  providers: [CisInitService, VectorStoreService],
  exports: [VectorStoreService],
})
export class CisModule {}
