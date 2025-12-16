import { Test, TestingModule } from '@nestjs/testing';
import { ShopItemsV2Controller } from './shop-items-v2.controller';
import { ShopItemsV2Service } from './shop-items-v2.service';
import { MediaService } from '../media/media.service';
import { ShopItemV2 } from './schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from './dto/shop-items-v2.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShopItemsV2Controller', () => {
  let controller: ShopItemsV2Controller;
  let service: jest.Mocked<ShopItemsV2Service>;
  let mediaService: jest.Mocked<MediaService>;

  const mockItem: ShopItemV2 = {
    id: 'PROD-001',
    photos: ['https://example.com/photo1.jpg'],
    title: { en: 'Test Product', ua: 'Тестовий продукт' },
    price: { uah: 1000, eur: 30 },
    discountPrice: { uah: 800, eur: 24 },
    isDiscountActive: true,
    description: { en: 'Test description', ua: 'Тестовий опис' },
    detailedDescription: { en: 'Detailed', ua: 'Детальний' },
    color: { en: 'Red', ua: 'Червоний', hex: '#FF0000' },
    sizeGuideUrl: null,
    amount: { S: 5, M: 10 },
    collectionName: 'Test Collection',
    categories: ['test'],
    isComingSoon: false,
    isSoldOut: false,
    isHidden: false,
    position: 1,
  } as ShopItemV2;

  beforeEach(async () => {
    const mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByCategory: jest.fn(),
      getByCollection: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updatePhotos: jest.fn(),
    };

    const mockMediaService = {
      uploadShopItemMedia: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopItemsV2Controller],
      providers: [
        {
          provide: ShopItemsV2Service,
          useValue: mockService,
        },
        {
          provide: MediaService,
          useValue: mockMediaService,
        },
      ],
    }).compile();

    controller = module.get<ShopItemsV2Controller>(ShopItemsV2Controller);
    service = module.get(ShopItemsV2Service);
    mediaService = module.get(MediaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all items', async () => {
      const items = [mockItem];
      service.getAll.mockResolvedValue(items);

      const result = await controller.getAll();

      expect(result).toEqual(items);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should filter by category when provided', async () => {
      const items = [mockItem];
      service.getByCategory.mockResolvedValue(items);

      const result = await controller.getAll('test');

      expect(result).toEqual(items);
      expect(service.getByCategory).toHaveBeenCalledWith('test');
      expect(service.getAll).not.toHaveBeenCalled();
    });

    it('should filter by collection when provided', async () => {
      const items = [mockItem];
      service.getByCollection.mockResolvedValue(items);

      const result = await controller.getAll(undefined, 'Test Collection');

      expect(result).toEqual(items);
      expect(service.getByCollection).toHaveBeenCalledWith('Test Collection');
      expect(service.getAll).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return item by id', async () => {
      service.getById.mockResolvedValue(mockItem);

      const result = await controller.getById('PROD-001');

      expect(result).toEqual(mockItem);
      expect(service.getById).toHaveBeenCalledWith('PROD-001');
    });

    it('should throw NotFoundException if item not found', async () => {
      service.getById.mockRejectedValue(
        new NotFoundException('Shop item with ID NONEXISTENT not found'),
      );

      await expect(controller.getById('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto: CreateShopItemV2Dto = {
      id: 'PROD-002',
      photos: [],
      title: { en: 'New Product', ua: 'Новий продукт' },
      price: { uah: 2000, eur: 60 },
      discountPrice: { uah: 2000, eur: 60 },
      isDiscountActive: false,
      description: { en: 'New', ua: 'Новий' },
      detailedDescription: { en: 'New detailed', ua: 'Новий детальний' },
      color: { name: { en: 'Blue', ua: 'Синій' } },
      amount: { M: 3 },
      collectionName: 'New Collection',
      categories: ['new'],
    };

    it('should create new item', async () => {
      const createdItem = { ...createDto, sizeGuideUrl: null } as unknown as ShopItemV2;
      service.create.mockResolvedValue(createdItem);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdItem);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update item', async () => {
      const updateDto = { title: { en: 'Updated', ua: 'Оновлено' } };
      const updatedItem = { ...mockItem, ...updateDto };
      service.update.mockResolvedValue(updatedItem as ShopItemV2);

      const result = await controller.update('PROD-001', updateDto);

      expect(result).toEqual(updatedItem);
      expect(service.update).toHaveBeenCalledWith('PROD-001', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete item', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('PROD-001');

      expect(service.delete).toHaveBeenCalledWith('PROD-001');
    });
  });

  describe('updatePhotos', () => {
    it('should update photos', async () => {
      const newPhotos = ['https://example.com/new-photo.jpg'];
      const updatedItem = { ...mockItem, photos: newPhotos };
      service.updatePhotos.mockResolvedValue(updatedItem as ShopItemV2);

      const result = await controller.updatePhotos('PROD-001', newPhotos);

      expect(result.photos).toEqual(newPhotos);
      expect(service.updatePhotos).toHaveBeenCalledWith('PROD-001', newPhotos);
    });
  });
});

