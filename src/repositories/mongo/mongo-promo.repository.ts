import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPromoRepository } from '../interfaces/promo.repository.interface';
import { PromoItem, PromoItemDocument } from '../../promos/schemas/promo-item.schema';
import { CreatePromoDto } from '../../promos/dto/create-promo.dto';

/**
 * Real MongoDB repository for Promos.
 */
@Injectable()
export class MongoPromoRepository implements IPromoRepository {
  constructor(
    @InjectModel(PromoItem.name) private promoItemModel: Model<PromoItemDocument>,
  ) {}

  async findByCode(code: string): Promise<PromoItem | null> {
    return this.promoItemModel.findOne({ name: code }).exec();
  }

  async create(promoDto: CreatePromoDto): Promise<PromoItem> {
    const newPromo = new this.promoItemModel(promoDto);
    return newPromo.save();
  }
}

