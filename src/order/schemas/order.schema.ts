import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderUADocument = OrderUA & Document;
export type OrderWWDocument = OrderWW & Document;

@Schema()
export class OrderUA {
  @Prop({ required: true })
  approved: boolean;

  @Prop({ required: true })
  orderId: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        size: { type: [String, null], required: false },
        title: { type: String, required: true },
        additionalParams: { type: [String], required: false },
      },
    ],
  })
  items: {
    id: string;
    size: string;
    title: string;
    additionalParams?: string[];
  }[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 'ukraine' })
  orderType: 'ukraine';

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  novaPoshta: string;

  @Prop({ required: true })
  agreement: boolean;

  @Prop({
    type: {
      name: { type: String },
      discount: { type: Number },
    },
  })
  promo: { name: string; discount: number };

  @Prop({ required: true })
  createdDateString: string;

  @Prop({ required: true })
  delivery: number;

  @Prop({ required: true })
  currency: 'uah' | 'eur';

  @Prop({ required: false })
  utm_source: string;

  @Prop({ required: false })
  utm_campaign: string;
}

@Schema()
export class OrderWW {
  @Prop({ required: true })
  approved: boolean;

  @Prop({ required: true })
  orderId: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        size: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
  })
  items: { id: string; size: string; title: string }[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 'worldwide' })
  orderType: 'worldwide';

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  countryCityRegion: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  agreement: boolean;

  @Prop({
    type: {
      name: { type: String },
      discount: { type: Number },
    },
  })
  promo: { name: string; discount: number };

  @Prop({ required: true })
  createdDateString: string;

  @Prop({ required: true })
  delivery: number;

  @Prop({ required: true })
  currency: 'uah' | 'eur';

  @Prop({ required: false })
  utm_source: string;

  @Prop({ required: false })
  utm_campaign: string;
}

export const OrderUASchema = SchemaFactory.createForClass(OrderUA);
export const OrderWWSchema = SchemaFactory.createForClass(OrderWW);
