import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema()
export class Certificate {
  @Prop()
  code: string;

  @Prop()
  createdAt: string;

  @Prop()
  owner: string;

  @Prop()
  amount: number;
}
export const CertificateSchema = SchemaFactory.createForClass(Certificate);
