import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';

export const OPENAI_EMBEDDINGS = 'OPENAI_EMBEDDINGS';

export const EmbeddingsProvider: Provider = {
  provide: OPENAI_EMBEDDINGS,
  useFactory: (configService: ConfigService) =>
    new OpenAIEmbeddings({
      model: configService.get<string>('EMBEDDING_MODEL') ?? 'text-embedding-3-small',
      apiKey: configService.get<string>('OPENAI_API_KEY'),
    }),
  inject: [ConfigService],
};