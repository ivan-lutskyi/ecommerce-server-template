import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ShopItemsV2Service } from './shop-items-v2.service';
import { ShopItemV2 } from './schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from './dto/shop-items-v2.dto';
import { MediaService } from '../media/media.service';
import { Express } from 'express';

@Controller('shop-items-v2')
export class ShopItemsV2Controller {
  constructor(
    private readonly shopItemsV2Service: ShopItemsV2Service,
    private readonly mediaService: MediaService
  ) {}

  @Get()
  async getAll(
    @Query('category') category?: string,
    @Query('collection') collection?: string
  ): Promise<ShopItemV2[]> {
    if (category) {
      return this.shopItemsV2Service.getByCategory(category);
    }
    if (collection) {
      return this.shopItemsV2Service.getByCollection(collection);
    }
    return this.shopItemsV2Service.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ShopItemV2> {
    return this.shopItemsV2Service.getById(id);
  }

  @Post()
  async create(@Body() createShopItemDto: CreateShopItemV2Dto): Promise<ShopItemV2> {
    return this.shopItemsV2Service.create(createShopItemDto);
  }

  @Post('with-media')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async createWithMedia(
    @Body('data') createShopItemDtoString: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ShopItemV2> {
    // Parse the JSON data from form field
    let createShopItemDto: CreateShopItemV2Dto;
    try {
      createShopItemDto = JSON.parse(createShopItemDtoString);
    } catch (error) {
      throw new BadRequestException('Invalid JSON data format');
    }

    // Step 1: Create the shop item first (without photos)
    const createdItem = await this.shopItemsV2Service.create({
      ...createShopItemDto,
      photos: [], // Will be updated after media upload
    });

    // Step 2: If files are provided, upload them and update the item
    if (files && files.length > 0) {
      // Validate file types
      for (const file of files) {
        const isValidImage = file.mimetype.startsWith('image/');
        const isValidVideo = file.mimetype.startsWith('video/');
        
        if (!isValidImage && !isValidVideo) {
          throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
        }
      }

      // Upload media files with custom naming
      const uploadResults = await this.mediaService.uploadShopItemMedia(files, createdItem.id);
      const photoUrls = uploadResults.map(result => result.url);

      // Update the item with photo URLs
      return this.shopItemsV2Service.updatePhotos(createdItem.id, photoUrls);
    }

    return createdItem;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShopItemDto: Partial<CreateShopItemV2Dto>
  ): Promise<ShopItemV2> {
    return this.shopItemsV2Service.update(id, updateShopItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.shopItemsV2Service.delete(id);
  }

  @Put(':id/photos')
  async updatePhotos(
    @Param('id') id: string,
    @Body('photos') photos: string[]
  ): Promise<ShopItemV2> {
    return this.shopItemsV2Service.updatePhotos(id, photos);
  }
}
