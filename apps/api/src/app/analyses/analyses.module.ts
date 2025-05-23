import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalysesService } from './analyses.service';
import { AnalysesController } from './analyses.controller';
import { Analysis, AnalysisSchema } from './schemas/analysis.schema';
import { CisModule } from '../cis/cis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Analysis.name, schema: AnalysisSchema }]),
    CisModule,
  ],
  controllers: [AnalysesController],
  providers: [AnalysesService],
  exports: [AnalysesService],
})
export class AnalysesModule {}
