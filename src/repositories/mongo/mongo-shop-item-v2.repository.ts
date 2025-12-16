import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IShopItemV2Repository } from '../interfaces/shop-item-v2.repository.interface';
import { ShopItemV2, ShopItemV2Document } from '../../shop-items-v2/schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from '../../shop-items-v2/dto/shop-items-v2.dto';

/**
 * Real MongoDB repository for ShopItemV2.
 * Used when MONGO_URI is provided and USE_MOCK_REPOSITORIES is not set to 'true'.
 */
@Injectable()
export class MongoShopItemV2Repository implements IShopItemV2Repository {
  constructor(
    @InjectModel(ShopItemV2.name)
    private shopItemV2Model: Model<ShopItemV2Document>,
  ) {}

  async findAll(): Promise<ShopItemV2[]> {
    return this.shopItemV2Model
      .find()
      .sort({ position: 1, id: 1 })
      .lean()
      .exec();
  }

  async findById(id: string): Promise<ShopItemV2 | null> {
    return this.shopItemV2Model.findOne({ id }).lean().exec();
  }

  async findByCategory(category: string): Promise<ShopItemV2[]> {
    return this.shopItemV2Model
      .find({ categories: category })
      .sort({ position: 1, id: 1 })
      .lean()
      .exec();
  }

  async findByCollection(collectionName: string): Promise<ShopItemV2[]> {
    return this.shopItemV2Model
      .find({ collectionName })
      .sort({ position: 1, id: 1 })
      .lean()
      .exec();
  }

  async create(createDto: CreateShopItemV2Dto): Promise<ShopItemV2> {
    const createdItem = new this.shopItemV2Model(createDto);
    return createdItem.save();
  }

  async update(
    id: string,
    updateDto: Partial<CreateShopItemV2Dto>,
  ): Promise<ShopItemV2 | null> {
    return this.shopItemV2Model
      .findOneAndUpdate({ id }, updateDto, { new: true, runValidators: true })
      .lean()
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.shopItemV2Model.findOneAndDelete({ id }).exec();
    return !!result;
  }

  async updatePhotos(id: string, photos: string[]): Promise<ShopItemV2 | null> {
    return this.shopItemV2Model
      .findOneAndUpdate({ id }, { photos }, { new: true })
      .lean()
      .exec();
  }
}

