import { CreatePromoDto } from '../../promos/dto/create-promo.dto';
import { PromoItem } from '../../promos/schemas/promo-item.schema';

export interface IPromoRepository {
  findByCode(code: string): Promise<PromoItem | null>;
  create(promoDto: CreatePromoDto): Promise<PromoItem>;
}

