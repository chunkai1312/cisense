import { Module } from '@nestjs/common';
import { CisInitService } from './cis-init.service';
import { LangchainModule } from '../langchain/langchain.module';

@Module({
  imports: [LangchainModule],
  providers: [CisInitService],
})
export class CisModule {}
