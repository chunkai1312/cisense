import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { convertImageToBase64WithMime } from '../utils/image-to-base64.util';
import { ImageComparisonChain } from '../chains/image-comparison.chain';
import { CisEvaluationChain, EvaluationResult } from '../chains/cis-evaluation.chain';
import { CisGuidelineRetriever } from '../retrievers/cis-guideline.retriever';

@Injectable()
export class AnalysisChainsService {
  constructor(
    private readonly semanticRetriever: CisGuidelineRetriever,
    private readonly imageComparisonChain: ImageComparisonChain,
    private readonly cisEvaluationChain: CisEvaluationChain,
  ) {}

  async process(
    imagePath: string,
    cisName: string,
  ): Promise<EvaluationResult & { imagePath: string; cisName: string }> {
    const userImage = await convertImageToBase64WithMime(imagePath);
    const logoPath = path.resolve(
      process.cwd(),
      process.env.CIS_IMG_PATH as string,
    );
    const brandImage = await convertImageToBase64WithMime(logoPath);
    const collectionName = cisName;

    const cisText = await this.semanticRetriever.retrieve(
      '企業識別規範摘要',
      collectionName,
    );
    const imageComparison = await this.imageComparisonChain.run(
      brandImage,
      userImage,
    );
    const evaluationResult = await this.cisEvaluationChain.run(
      imageComparison,
      cisText,
    );

    return { ...evaluationResult, imagePath, cisName };
  }
}