import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore as LangchainQdrantVectorStore } from '@langchain/qdrant';

@Injectable()
export class QdrantVectorStore {
  async indexDocuments(docs: Document[], collectionName: string): Promise<string> {
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);

    await LangchainQdrantVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      }),
      {
        collectionName,
        url: process.env.QDRANT_URL,
      },
    );

    return collectionName;
  }

  async retrieveRelevantText(
    query: string,
    collectionName: string,
    k = 5,
  ): Promise<string> {
    const vectorStore = await LangchainQdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      }),
      {
        collectionName,
        url: process.env.QDRANT_URL,
      },
    );

    const retriever = vectorStore.asRetriever({ k });
    const docs = await retriever.invoke(query);
    return docs.map((doc) => doc.pageContent).join('\n\n');
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    const vectorStore = await LangchainQdrantVectorStore.fromExistingCollection(
      new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
      }),
      {
        collectionName,
        url: process.env.QDRANT_URL,
      },
    );

    const results = await vectorStore.similaritySearch('test', 1);
    return results.length > 0;
  }
}