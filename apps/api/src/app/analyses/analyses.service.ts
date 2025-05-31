import * as path from 'path';
import * as fs from 'fs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { HumanMessage } from '@langchain/core/messages';
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { Analysis } from './schemas/analysis.schema';
import { VectorStoreService } from '../cis/vector-store.service';
import { convertImageToBase64WithMime } from './utils/image-to-base64.util';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectModel(Analysis.name) private readonly model: Model<Analysis>,
    private readonly vectorStoreService: VectorStoreService,
  ) { }

  async analyzeImage(imagePath: string, cisName: string) {
    const userImage = await convertImageToBase64WithMime(imagePath);
    const logoPath = path.resolve(process.cwd(), process.env.CIS_IMG_PATH as string);
    const brandImage = await convertImageToBase64WithMime(logoPath);
    const collectionName = cisName;

    const visualObservation = await this.runVisualObservationPrompt(brandImage, userImage);
    const cisText = await this.vectorStoreService.retrieveRelevantText('企業識別規範摘要', collectionName);
    const result = await this.runFinalEvaluationPrompt(visualObservation, cisText);

    const analysis = {
      imagePath,
      cisName,
      score: result.score,
      summary: result.summary,
      suggestions: result.suggestions,
      modelUsed: 'gpt-4-turbo',
    };

    return await this.create(analysis);
  }

  private async runVisualObservationPrompt(brandImage: string, userImage: string) {
    const parser = new StringOutputParser();

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `你是品牌設計審查助理，協助觀察兩張圖像在設計上的差異。`,
      ),
      HumanMessagePromptTemplate.fromTemplate(
        `以下是兩張圖像：

  - 第一張為企業官方主視覺
  - 第二張為使用者設計圖

  請描述兩張圖像在顏色、字體、排版、比例、風格等方面的差異，請列出簡潔明確的觀察點。

  不需要評分，不要下結論，也不需要建議，僅陳述客觀觀察結果。`
      ),
    ]);

    const model = new ChatOpenAI({
      modelName: 'gpt-4-turbo',
      temperature: 0.3,
      maxTokens: 1000,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = await prompt.formatMessages({});
    const [systemMessage, humanMessage] = messages;

    const imageMessage = new HumanMessage({
      content: [
        ...((humanMessage as HumanMessage).content as any[]),
        { type: 'image_url', image_url: { url: brandImage } },
        { type: 'image_url', image_url: { url: userImage } },
      ],
    });

    const response = await model.invoke([systemMessage, imageMessage]);
    return parser.parse(response.content as string);
  }

  private async runFinalEvaluationPrompt(observationText: string, cisText: string) {
    const evaluationSchema = z.object({
      score: z.number().min(0).max(100).describe('整數分數，0 到 100，代表符合規範程度'),
      summary: z.string().describe('簡要說明評估結果'),
      suggestions: z.array(z.string()).describe('具體改善建議，每個建議可為一段完整說明，列為陣列'),
    });

    const parser = StructuredOutputParser.fromZodSchema(evaluationSchema);

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `你是企業品牌設計審查專家，根據企業識別文件來分析圖像是否符合規範。`,
      ),
      HumanMessagePromptTemplate.fromTemplate(
        `以下是圖像觀察結果（使用者設計 vs 官方主視覺）：
  {observation}

  以下是企業識別系統（CIS）文件摘要：
  {context}

  請根據企業識別規範，評估這張圖像的整體符合度。

  請回傳以下格式：
  {format_instructions}`
      ),
    ]);

    const model = new ChatOpenAI({
      modelName: 'gpt-4-turbo',
      temperature: 0.3,
      maxTokens: 1000,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = await prompt.formatMessages({
      observation: observationText,
      context: cisText,
      format_instructions: parser.getFormatInstructions(),
    });

    const [systemMessage, humanMessage] = messages;
    const response = await model.invoke([systemMessage, humanMessage]);
    return parser.parse(response.content as string);
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
