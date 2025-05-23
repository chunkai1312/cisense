import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Analysis extends Document {
  @Prop({ required: true })
  imagePath!: string;

  @Prop({ required: true })
  cisName!: string;

  @Prop({ required: true, min: 0, max: 100 })
  score!: number;

  @Prop({ required: true })
  summary!: string;

  @Prop({ type: [String], default: [] })
  suggestions!: string[];

  @Prop({ required: true })
  modelUsed!: string;
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);
