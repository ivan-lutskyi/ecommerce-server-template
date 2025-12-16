import { CreatePromoDto } from '../../promos/dto/create-promo.dto';

type SizeType = 'XS' | 'S' | 'M' | 'L';

export type Order = {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  agreement: boolean;
  countryCityRegion: string;
  promo: CreatePromoDto | null;
  currency: 'eur' | 'uah';
};

export type OrderUADto = {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  novaPoshta: string;
  agreement: boolean;
  promo: CreatePromoDto | null;
  currency: 'eur' | 'uah';
};
export type OrderWWDto = {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  postalCode: string;
  countryCityRegion: string;
  address: string;
  agreement: boolean;
  promo: CreatePromoDto | null;
  currency: 'eur' | 'uah';
};
export interface CreateOrderDto {
  items: {
    id: string;
    size: SizeType;
    title: string;
    additionalParams?: string[];
  }[];
  price: number;
  approved: boolean;
  orderId: string;
  orderType: 'ukraine' | 'worldwide';
  orderData: OrderUADto | OrderWWDto;
  promo: { promo: string; discount: number } | null;
  utm_source?: string;
  utm_campaign?: string;
}
