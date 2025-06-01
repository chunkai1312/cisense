import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantVectorStore as LangchainQdrantVectorStore } from '@langchain/qdrant';
import { OPENAI_EMBEDDINGS } from './embeddings.provider';

export const QDRANT_VECTORSTORE = 'QDRANT_VECTORSTORE';

export const QdrantVectorstoreProvider: Provider = {
  provide: QDRANT_VECTORSTORE,
  useFactory: (embeddings: any, configService: ConfigService) =>
    LangchainQdrantVectorStore.fromExistingCollection(embeddings, {
      url: configService.get<string>('QDRANT_URL'),
      collectionName: configService.get<string>('CIS_NAME') ?? 'cis',
    }),
  inject: [OPENAI_EMBEDDINGS, ConfigService],
};