import { Injectable } from '@nestjs/common';
import { IShopItemV2Repository } from '../interfaces/shop-item-v2.repository.interface';
import { ShopItemV2 } from '../../shop-items-v2/schemas/shop-item-v2.schema';
import { CreateShopItemV2Dto } from '../../shop-items-v2/dto/shop-items-v2.dto';

/**
 * Mock repository for ShopItemV2 with in-memory data storage.
 * Used when MongoDB is not available or USE_MOCK_REPOSITORIES=true.
 */
@Injectable()
export class MockShopItemV2Repository implements IShopItemV2Repository {
  private items: ShopItemV2[] = [
    {
      id: 'PROD-001',
      photos: [
        'https://via.placeholder.com/800/000000/FFFFFF?text=Product+1+Photo+1',
        'https://via.placeholder.com/800/000000/FFFFFF?text=Product+1+Photo+2',
      ],
      title: { en: 'Classic Wool Coat', ua: 'Класичне шерстяне пальто' },
      price: { uah: 5000, eur: 150 },
      discountPrice: { uah: 4000, eur: 120 },
      isDiscountActive: true,
      description: {
        en: 'A timeless classic wool coat perfect for any season',
        ua: 'Безчасова класична шерстяна пальто, ідеальна для будь-якого сезону',
      },
      detailedDescription: {
        en: 'Made from premium wool blend, this coat offers warmth and style.',
        ua: 'Виготовлено з преміальної шерстяної суміші, це пальто забезпечує тепло та стиль.',
      },
      color: { en: 'Black', ua: 'Чорний' },
      sizeGuideUrl: null,
      amount: { XS: 2, S: 5, M: 8, L: 3 },
      collectionName: 'Winter Collection 2024',
      categories: ['outerwear', 'coats'],
      isComingSoon: false,
      isSoldOut: false,
      isHidden: false,
      position: 1,
    } as ShopItemV2,
    {
      id: 'PROD-002',
      photos: [
        'https://via.placeholder.com/800/FFFFFF/000000?text=Product+2+Photo+1',
        'https://via.placeholder.com/800/FFFFFF/000000?text=Product+2+Photo+2',
      ],
      title: { en: 'Cotton T-Shirt', ua: 'Бавняна футболка' },
      price: { uah: 800, eur: 25 },
      discountPrice: { uah: 800, eur: 25 },
      isDiscountActive: false,
      description: {
        en: 'Comfortable cotton t-shirt for everyday wear',
        ua: 'Зручна бавняна футболка для щоденного носіння',
      },
      detailedDescription: {
        en: '100% organic cotton, breathable and soft.',
        ua: '100% органічна бавовна, дихаюча та м\'яка.',
      },
      color: { en: 'White', ua: 'Білий' },
      sizeGuideUrl: null,
      amount: { S: 10, M: 15, L: 12, XL: 8 },
      collectionName: 'Summer Essentials',
      categories: ['basics', 't-shirts'],
      isComingSoon: false,
      isSoldOut: false,
      isHidden: false,
      position: 2,
    } as ShopItemV2,
    {
      id: 'PROD-003',
      photos: [
        'https://via.placeholder.com/800/8B4513/FFFFFF?text=Product+3+Photo+1',
      ],
      title: { en: 'Leather Jacket', ua: 'Шкіряна куртка' },
      price: { uah: 12000, eur: 350 },
      discountPrice: { uah: 12000, eur: 350 },
      isDiscountActive: false,
      description: {
        en: 'Genuine leather jacket with modern design',
        ua: 'Справжня шкіряна куртка з сучасним дизайном',
      },
      detailedDescription: {
        en: 'Premium quality leather, handcrafted with attention to detail.',
        ua: 'Преміальна якість шкіри, виготовлено вручну з увагою до деталей.',
      },
      color: { en: 'Brown', ua: 'Коричневий' },
      sizeGuideUrl: null,
      amount: { M: 3, L: 2 },
      collectionName: 'Autumn Collection 2024',
      categories: ['outerwear', 'jackets'],
      isComingSoon: false,
      isSoldOut: false,
      isHidden: false,
      position: 3,
    } as ShopItemV2,
  ];

  async findAll(): Promise<ShopItemV2[]> {
    return [...this.items].sort((a, b) => {
      if (a.position !== undefined && b.position !== undefined) {
        return a.position - b.position;
      }
      if (a.position !== undefined) return -1;
      if (b.position !== undefined) return 1;
      return a.id.localeCompare(b.id);
    });
  }

  async findById(id: string): Promise<ShopItemV2 | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findByCategory(category: string): Promise<ShopItemV2[]> {
    return this.items.filter((item) => item.categories.includes(category));
  }

  async findByCollection(collectionName: string): Promise<ShopItemV2[]> {
    return this.items.filter((item) => item.collectionName === collectionName);
  }

  async create(createDto: CreateShopItemV2Dto): Promise<ShopItemV2> {
    // Convert DTO color format to schema format
    const colorSchema = {
      en: createDto.color.name.en,
      ua: createDto.color.name.ua,
    };
    
    const newItem = {
      ...createDto,
      color: colorSchema,
      sizeGuideUrl: createDto.sizeGuides ? null : null,
    } as unknown as ShopItemV2;
    this.items.push(newItem);
    return newItem;
  }

  async update(
    id: string,
    updateDto: Partial<CreateShopItemV2Dto>,
  ): Promise<ShopItemV2 | null> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...updateDto } as ShopItemV2;
    return this.items[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async updatePhotos(id: string, photos: string[]): Promise<ShopItemV2 | null> {
    const item = await this.findById(id);
    if (!item) return null;
    item.photos = photos;
    return item;
  }
}

