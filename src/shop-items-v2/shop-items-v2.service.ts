import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { ShopItemV2 } from './schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from './dto/shop-items-v2.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { IShopItemV2Repository } from '../repositories/interfaces/shop-item-v2.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

@Injectable()
export class ShopItemsV2Service {
  constructor(
    @Inject(REPOSITORY_TOKENS.SHOP_ITEM_V2)
    private shopItemV2Repository: IShopItemV2Repository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAll(): Promise<ShopItemV2[]> {
    try {
      const items = await this.shopItemV2Repository.findAll();
      console.log(`🔍 Retrieved ${items.length} items from repository`);
      return items;
    } catch (error) {
      console.error('❌ Error in getAll service:', error.message);
      throw error;
    }
  }

  async getById(id: string): Promise<ShopItemV2> {
    const item = await this.shopItemV2Repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }
    return item;
  }

  async create(createShopItemDto: CreateShopItemV2Dto): Promise<ShopItemV2> {
    // Check if item with this ID already exists
    const existingItem = await this.shopItemV2Repository.findById(createShopItemDto.id);
    if (existingItem) {
      throw new BadRequestException(`Shop item with ID ${createShopItemDto.id} already exists`);
    }

    return this.shopItemV2Repository.create(createShopItemDto);
  }

  async update(id: string, updateShopItemDto: Partial<CreateShopItemV2Dto>): Promise<ShopItemV2> {
    const updatedItem = await this.shopItemV2Repository.update(id, updateShopItemDto);
    
    if (!updatedItem) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }
    
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    // First, get the item to access its photos for cleanup
    const item = await this.shopItemV2Repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }

    // Extract Cloudinary public IDs from photo URLs for deletion
    const cloudinaryPublicIds: string[] = [];
    if (item.photos && item.photos.length > 0) {
      item.photos.forEach(photoUrl => {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud/image/upload/.../shopItems/images/PROD-001/PROD-001_1.jpg
        const match = photoUrl.match(/\/shopItems\/images\/([^\/]+)\/([^.]+)/);
        if (match) {
          const publicId = `shopItems/images/${match[1]}/${match[2]}`;
          cloudinaryPublicIds.push(publicId);
        }
      });
    }

    // Delete the item from repository
    const deleted = await this.shopItemV2Repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }

    // Clean up Cloudinary files asynchronously (don't block the response)
    if (cloudinaryPublicIds.length > 0) {
      console.log(`🗑️  Cleaning up ${cloudinaryPublicIds.length} Cloudinary files for item ${id}`);
      
      // Delete each file from Cloudinary
      for (const publicId of cloudinaryPublicIds) {
        try {
          await this.cloudinaryService.deleteFile(publicId);
          console.log(`✅ Deleted Cloudinary file: ${publicId}`);
        } catch (error) {
          console.error(`❌ Failed to delete Cloudinary file ${publicId}:`, error);
        }
      }
    }
  }

  async updatePhotos(id: string, photos: string[]): Promise<ShopItemV2> {
    const updatedItem = await this.shopItemV2Repository.updatePhotos(id, photos);
    
    if (!updatedItem) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }
    
    return updatedItem;
  }

  async getByCategory(category: string): Promise<ShopItemV2[]> {
    return this.shopItemV2Repository.findByCategory(category);
  }

  async getByCollection(collectionName: string): Promise<ShopItemV2[]> {
    return this.shopItemV2Repository.findByCollection(collectionName);
  }
}
