// shop-item-v2.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopItemV2Document = ShopItemV2 & Document;

@Schema({ collection: 'shopitemsv2' })
export class ShopItemV2 {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) photos: string[];
  @Prop({ type: { en: String, ua: String }, required: true })
  title: { en: string; ua: string };
  @Prop({ type: { uah: Number, eur: Number }, required: true })
  price: { uah: number; eur: number };
  @Prop({ type: { uah: Number, eur: Number }, required: true })
  discountPrice: { uah: number; eur: number };
  @Prop({ required: true }) isDiscountActive: boolean;
  @Prop({ type: { en: String, ua: String }, required: true })
  description: { en: string; ua: string };
  @Prop({ type: { en: String, ua: String }, required: true })
  detailedDescription: { en: string; ua: string };
  @Prop({ type: { en: String, ua: String }, required: true })
  color: { en: string; ua: string };
  @Prop() sizeGuideUrl: string;
  @Prop({ type: Object, default: {} }) amount: Record<string, number>;
  @Prop({ required: true }) collectionName: string;
  @Prop({ required: true }) categories: string[];
  @Prop() isComingSoon: boolean;
  @Prop() isSoldOut: boolean;
  @Prop() isHidden: boolean;
  
  @Prop({ default: null }) 
  position?: number; // For custom ordering in grid display
}

export const ShopItemV2Schema = SchemaFactory.createForClass(ShopItemV2);
