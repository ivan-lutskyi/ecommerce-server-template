import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { OrderUA, OrderWW } from '../../order/schemas/order.schema';
import { CreateOrderDto } from '../../order/dto/order.dto';

/**
 * Mock repository for Orders with in-memory data storage.
 */
@Injectable()
export class MockOrderRepository implements IOrderRepository {
  private orders: (OrderUA | OrderWW)[] = [
    {
      approved: false,
      orderId: 'ORD-001',
      items: [
        {
          id: 'PROD-001',
          size: 'M',
          title: 'Classic Wool Coat',
        },
      ],
      price: 5000,
      orderType: 'ukraine',
      email: 'customer@example.com',
      fullName: 'John Doe',
      phone: '+380501234567',
      city: 'Kyiv',
      novaPoshta: '12345',
      agreement: true,
      promo: null,
      createdDateString: new Date().toISOString(),
      delivery: 100,
      currency: 'uah',
      utm_source: null,
      utm_campaign: null,
    } as OrderUA,
    {
      approved: true,
      orderId: 'ORD-002',
      items: [
        {
          id: 'PROD-002',
          size: 'L',
          title: 'Cotton T-Shirt',
        },
      ],
      price: 800,
      orderType: 'ukraine',
      email: 'another@example.com',
      fullName: 'Jane Smith',
      phone: '+380509876543',
      city: 'Lviv',
      novaPoshta: '67890',
      agreement: true,
      promo: { name: 'SUMMER10', discount: 10 },
      createdDateString: new Date().toISOString(),
      delivery: 100,
      currency: 'uah',
      utm_source: null,
      utm_campaign: null,
    } as OrderUA,
    {
      approved: false,
      orderId: 'ORD-003',
      items: [
        {
          id: 'PROD-003',
          size: 'M',
          title: 'Leather Jacket',
        },
      ],
      price: 12000,
      orderType: 'worldwide',
      email: 'international@example.com',
      fullName: 'Bob Johnson',
      phone: '+1234567890',
      countryCityRegion: 'United States',
      city: 'New York',
      postalCode: '10001',
      address: '123 Main Street',
      agreement: true,
      promo: null,
      createdDateString: new Date().toISOString(),
      delivery: 500,
      currency: 'eur',
      utm_source: null,
      utm_campaign: null,
    } as OrderWW,
  ];

  async findAll(): Promise<(OrderUA | OrderWW)[]> {
    return [...this.orders];
  }

  async findById(orderId: string): Promise<OrderUA | OrderWW | null> {
    return this.orders.find((order) => order.orderId === orderId) || null;
  }

  async findByEmail(email: string): Promise<(OrderUA | OrderWW)[]> {
    const emailRegex = new RegExp(email, 'i');
    return this.orders.filter((order) => emailRegex.test(order.email));
  }

  async create(orderDto: CreateOrderDto): Promise<OrderUA | OrderWW> {
    const baseData = {
      ...orderDto,
      ...orderDto.orderData,
      approved: false,
      orderId: `ORD-${Date.now()}`,
      createdDateString: new Date().toISOString(),
      delivery: (orderDto.orderData as any)?.delivery || 0,
    };

    const newOrder =
      orderDto.orderType === 'ukraine'
        ? ({
            ...baseData,
            novaPoshta: (orderDto.orderData as any).novaPoshta || '',
            delivery: baseData.delivery,
          } as OrderUA)
        : ({
            ...baseData,
            countryCityRegion: (orderDto.orderData as any).countryCityRegion || '',
            postalCode: (orderDto.orderData as any).postalCode || '',
            address: (orderDto.orderData as any).address || '',
            delivery: baseData.delivery,
          } as OrderWW);

    this.orders.push(newOrder);
    return newOrder;
  }

  async delete(orderId: string): Promise<boolean> {
    const index = this.orders.findIndex((order) => order.orderId === orderId);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }

  async updateApproval(
    orderId: string,
    approved: boolean,
  ): Promise<OrderUA | OrderWW | null> {
    const order = await this.findById(orderId);
    if (!order) return null;
    order.approved = approved;
    return order;
  }
}

