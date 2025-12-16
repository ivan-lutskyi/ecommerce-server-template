import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromoItemDocument = PromoItem & Document;

@Schema()
export class PromoItem {
  @Prop()
  name: string;

  @Prop()
  discount: number;
}
export const PromoItemSchema = SchemaFactory.createForClass(PromoItem);
