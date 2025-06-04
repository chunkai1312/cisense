import { cisEvaluationSystem, cisEvaluationHuman } from '../prompts/cis-evaluation.prompt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

const evaluationSchema = z.object({
  score: z.number().min(0).max(100).describe('整數分數，0 到 100，代表符合規範程度'),
  summary: z.string().describe('簡要說明評估結果'),
  suggestions: z.array(z.string()).describe('具體改善建議，每個建議可為一段完整說明，列為陣列'),
});

export type EvaluationResult = z.infer<typeof evaluationSchema>;

@Injectable()
export class CisEvaluationChain {
  private readonly model: ChatOpenAI;
  private readonly parser = StructuredOutputParser.fromZodSchema(evaluationSchema);
  private readonly prompt: ChatPromptTemplate;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(cisEvaluationSystem),
      HumanMessagePromptTemplate.fromTemplate(cisEvaluationHuman),
    ]);
    this.model = new ChatOpenAI({
      modelName: 'gpt-4-turbo',
      temperature: 0.3,
      maxTokens: 1000,
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      configuration: {
        baseURL: this.configService.get<string>('OPENAI_API_BASE_URL') ?? 'https://api.openai.com/v1',
      },
    });
  }

  async run(observation: string, context: string): Promise<EvaluationResult> {
    const messages = await this.prompt.formatMessages({
      observation,
      context,
      format_instructions: this.parser.getFormatInstructions(),
    });
    const [systemMessage, humanMessage] = messages;
    const response = await this.model.invoke([systemMessage, humanMessage]);
    return this.parser.parse(response.content as string);
  }
}
