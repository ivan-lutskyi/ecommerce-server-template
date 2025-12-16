import { Injectable } from '@nestjs/common';
import { IPromoRepository } from '../interfaces/promo.repository.interface';
import { PromoItem } from '../../promos/schemas/promo-item.schema';
import { CreatePromoDto } from '../../promos/dto/create-promo.dto';

/**
 * Mock repository for Promos with in-memory data storage.
 */
@Injectable()
export class MockPromoRepository implements IPromoRepository {
  private promos: PromoItem[] = [
    {
      name: 'SUMMER10',
      discount: 10,
    } as PromoItem,
    {
      name: 'WINTER20',
      discount: 20,
    } as PromoItem,
    {
      name: 'NEWUSER15',
      discount: 15,
    } as PromoItem,
  ];

  async findByCode(code: string): Promise<PromoItem | null> {
    return this.promos.find((promo) => promo.name === code) || null;
  }

  async create(promoDto: CreatePromoDto): Promise<PromoItem> {
    const newPromo = {
      ...promoDto,
    } as PromoItem;
    this.promos.push(newPromo);
    return newPromo;
  }
}

