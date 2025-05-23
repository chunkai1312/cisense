import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';

@Injectable()
export class VectorStoreService {
  async indexDocuments(docs: Document[], collectionName: string): Promise<string> {
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);

    await QdrantVectorStore.fromDocuments(splitDocs, new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
      apiKey: process.env.OPENAI_API_KEY,
    }), {
      collectionName,
      url: process.env.QDRANT_URL,
    });

    return collectionName;
  }

  async retrieveRelevantText(query: string, collectionName: string): Promise<string> {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      }),
      {
        collectionName,
        url: process.env.QDRANT_URL,
      },
    );

    const retriever = vectorStore.asRetriever();
    const docs = await retriever.invoke(query);
    return docs.map((doc) => doc.pageContent).join('\n\n');
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      }),
      {
        collectionName,
        url: process.env.QDRANT_URL,
      }
    );

    const results = await vectorStore.similaritySearch('test', 1);
    return results.length > 0;
  }
}
