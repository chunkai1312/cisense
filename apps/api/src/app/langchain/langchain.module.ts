import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmbeddingsProvider, OPENAI_EMBEDDINGS } from './providers/embeddings.provider';
import { QdrantVectorstoreProvider, QDRANT_VECTORSTORE } from './providers/qdrant-vectorstore.provider';
import { QdrantVectorStore } from './vectorstores/qdrant.vectorstore';
import { CisGuidelineRetriever } from './retrievers/cis-guideline.retriever';
import { ImageComparisonChain } from './chains/image-comparison.chain';
import { CisEvaluationChain } from './chains/cis-evaluation.chain';
import { AnalysisChainsService } from './services/analysis-chains.service';

@Module({
  imports: [ConfigModule],
  providers: [
    EmbeddingsProvider,
    QdrantVectorstoreProvider,
    QdrantVectorStore,
    CisGuidelineRetriever,
    ImageComparisonChain,
    CisEvaluationChain,
    AnalysisChainsService,
  ],
  exports: [
    OPENAI_EMBEDDINGS,
    QDRANT_VECTORSTORE,
    QdrantVectorStore,
    CisGuidelineRetriever,
    ImageComparisonChain,
    CisEvaluationChain,
    AnalysisChainsService,
  ],
})
export class LangchainModule {}