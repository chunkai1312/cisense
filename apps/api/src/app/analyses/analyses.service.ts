import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analysis } from './schemas/analysis.schema';
import { AnalysisChainsService } from '../langchain/services/analysis-chains.service';
import * as fs from 'fs';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectModel(Analysis.name) private readonly model: Model<Analysis>,
    private readonly analysisChainsService: AnalysisChainsService,
  ) {}

  async analyzeImage(imagePath: string, cisName: string) {
    const result = await this.analysisChainsService.process(imagePath, cisName);
    const analysis: Partial<Analysis> = {
      imagePath: result.imagePath,
      cisName: result.cisName,
      score: result.score,
      summary: result.summary,
      suggestions: result.suggestions,
      modelUsed: 'gpt-4-turbo',
    };

    return this.create(analysis);
  }


  async create(data: Partial<Analysis>): Promise<Analysis> {
    const created = new this.model(data);
    return created.save();
  }

  async findAll(): Promise<Analysis[]> {
    const analyses = await this.model.find().sort({ createdAt: -1 }).lean().exec();
    return analyses;
  }

  async remove(id: string): Promise<void> {
    const analysis = await this.model.findById(id);
    if (!analysis) throw new NotFoundException('Analysis not found');

    try {
      if (fs.existsSync(analysis.imagePath)) {
        fs.unlinkSync(analysis.imagePath);
      }
    } catch (err) {
      Logger.warn('Image deletion failed:', err.message);
    }

    await this.model.findByIdAndDelete(id);
  }
}
