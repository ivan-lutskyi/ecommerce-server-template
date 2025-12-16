import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ShopItemsV2Service } from './shop-items-v2.service';
import { IShopItemV2Repository } from '../repositories/interfaces/shop-item-v2.repository.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';
import { ShopItemV2 } from './schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from './dto/shop-items-v2.dto';

describe('ShopItemsV2Service', () => {
  let service: ShopItemsV2Service;
  let repository: jest.Mocked<IShopItemV2Repository>;
  let cloudinaryService: jest.Mocked<CloudinaryService>;

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
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      findByCollection: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updatePhotos: jest.fn(),
    };

    const mockCloudinaryService = {
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopItemsV2Service,
        {
          provide: REPOSITORY_TOKENS.SHOP_ITEM_V2,
          useValue: mockRepository,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<ShopItemsV2Service>(ShopItemsV2Service);
    repository = module.get(REPOSITORY_TOKENS.SHOP_ITEM_V2);
    cloudinaryService = module.get(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all items', async () => {
      const items = [mockItem];
      repository.findAll.mockResolvedValue(items);

      const result = await service.getAll();

      expect(result).toEqual(items);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      repository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return item by id', async () => {
      repository.findById.mockResolvedValue(mockItem);

      const result = await service.getById('PROD-001');

      expect(result).toEqual(mockItem);
      expect(repository.findById).toHaveBeenCalledWith('PROD-001');
    });

    it('should throw NotFoundException if item not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getById('NONEXISTENT')).rejects.toThrow(
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
      repository.findById.mockResolvedValue(null);
      repository.create.mockResolvedValue({ ...createDto, sizeGuideUrl: null } as unknown as ShopItemV2);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException if item already exists', async () => {
      repository.findById.mockResolvedValue(mockItem);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update item', async () => {
      const updateDto = { title: { en: 'Updated', ua: 'Оновлено' } };
      const updatedItem = { ...mockItem, ...updateDto };
      repository.update.mockResolvedValue(updatedItem as ShopItemV2);

      const result = await service.update('PROD-001', updateDto);

      expect(result).toEqual(updatedItem);
      expect(repository.update).toHaveBeenCalledWith('PROD-001', updateDto);
    });

    it('should throw NotFoundException if item not found', async () => {
      repository.update.mockResolvedValue(null);

      await expect(service.update('NONEXISTENT', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete item', async () => {
      repository.findById.mockResolvedValue(mockItem);
      repository.delete.mockResolvedValue(true);

      await service.delete('PROD-001');

      expect(repository.delete).toHaveBeenCalledWith('PROD-001');
    });

    it('should throw NotFoundException if item not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should clean up Cloudinary files if photos exist', async () => {
      const itemWithPhotos = {
        ...mockItem,
        photos: [
          'https://res.cloudinary.com/cloud/image/upload/shopItems/images/PROD-001/PROD-001_1.jpg',
        ],
      };
      repository.findById.mockResolvedValue(itemWithPhotos);
      repository.delete.mockResolvedValue(true);
      cloudinaryService.deleteFile.mockResolvedValue(undefined);

      await service.delete('PROD-001');

      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith(
        'shopItems/images/PROD-001/PROD-001_1',
      );
    });
  });

  describe('updatePhotos', () => {
    it('should update photos', async () => {
      const newPhotos = ['https://example.com/new-photo.jpg'];
      const updatedItem = { ...mockItem, photos: newPhotos };
      repository.updatePhotos.mockResolvedValue(updatedItem as ShopItemV2);

      const result = await service.updatePhotos('PROD-001', newPhotos);

      expect(result.photos).toEqual(newPhotos);
      expect(repository.updatePhotos).toHaveBeenCalledWith('PROD-001', newPhotos);
    });

    it('should throw NotFoundException if item not found', async () => {
      repository.updatePhotos.mockResolvedValue(null);

      await expect(
        service.updatePhotos('NONEXISTENT', []),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getByCategory', () => {
    it('should return items by category', async () => {
      const items = [mockItem];
      repository.findByCategory.mockResolvedValue(items);

      const result = await service.getByCategory('test');

      expect(result).toEqual(items);
      expect(repository.findByCategory).toHaveBeenCalledWith('test');
    });
  });

  describe('getByCollection', () => {
    it('should return items by collection', async () => {
      const items = [mockItem];
      repository.findByCollection.mockResolvedValue(items);

      const result = await service.getByCollection('Test Collection');

      expect(result).toEqual(items);
      expect(repository.findByCollection).toHaveBeenCalledWith('Test Collection');
    });
  });
});

