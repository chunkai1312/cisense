export interface Analysis {
  _id: string;
  imagePath: string;
  cisName: string;
  score: number;
  summary: string;
  suggestions: string[];
  modelUsed: string;
  createdAt: string;
  updatedAt: string;
}
