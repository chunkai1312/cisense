import { imageComparisonSystem, imageComparisonHuman } from '../prompts/image-comparison.prompt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { HumanMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class ImageComparisonChain {
  private readonly model: ChatOpenAI;
  private readonly parser = new StringOutputParser();
  private readonly prompt: ChatPromptTemplate;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(imageComparisonSystem),
      HumanMessagePromptTemplate.fromTemplate(imageComparisonHuman),
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

  async run(brandImageUrl: string, userImageUrl: string): Promise<string> {
    const messages = await this.prompt.formatMessages({});
    const [systemMessage, humanMessage] = messages;
    const imageMessage = new HumanMessage({
      content: [
        ...((humanMessage as HumanMessage).content as any[]),
        { type: 'image_url', image_url: { url: brandImageUrl } },
        { type: 'image_url', image_url: { url: userImageUrl } },
      ],
    });
    const response = await this.model.invoke([systemMessage, imageMessage]);
    return this.parser.parse(response.content as string);
  }
}
