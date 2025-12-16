import { ShopItemV2 } from '../../shop-items-v2/schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from '../../shop-items-v2/dto/shop-items-v2.dto';

export interface IShopItemV2Repository {
  findAll(): Promise<ShopItemV2[]>;
  findById(id: string): Promise<ShopItemV2 | null>;
  findByCategory(category: string): Promise<ShopItemV2[]>;
  findByCollection(collectionName: string): Promise<ShopItemV2[]>;
  create(createDto: CreateShopItemV2Dto): Promise<ShopItemV2>;
  update(id: string, updateDto: Partial<CreateShopItemV2Dto>): Promise<ShopItemV2 | null>;
  delete(id: string): Promise<boolean>;
  updatePhotos(id: string, photos: string[]): Promise<ShopItemV2 | null>;
}

