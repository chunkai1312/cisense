import { Injectable } from '@nestjs/common';
import { QdrantVectorStore } from '../vectorstores/qdrant.vectorstore';

@Injectable()
export class CisGuidelineRetriever {
  constructor(private readonly vectorStore: QdrantVectorStore) {}

  async retrieve(
    query: string,
    collectionName: string,
    k = 5,
  ): Promise<string> {
    return this.vectorStore.retrieveRelevantText(query, collectionName, k);
  }
}