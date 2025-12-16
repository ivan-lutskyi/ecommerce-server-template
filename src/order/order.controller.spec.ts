import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { IOrderRepository } from '../repositories/interfaces/order.repository.interface';
import { IShopItemV2Repository } from '../repositories/interfaces/shop-item-v2.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';
import { CreateOrderDto } from './dto/order.dto';
import { OrderUA, OrderWW } from './schemas/order.schema';
import { HttpException, BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<OrderService>;

  const mockOrder: OrderUA = {
    approved: false,
    orderId: 'ORD-001',
    items: [{ id: 'PROD-001', size: 'M', title: 'Test Product' }],
    price: 1000,
    orderType: 'ukraine',
    email: 'test@example.com',
    fullName: 'John Doe',
    phone: '+1234567890',
    city: 'Kyiv',
    novaPoshta: '12345',
    agreement: true,
    promo: null,
    createdDateString: new Date().toISOString(),
    delivery: 100,
    currency: 'uah',
    utm_source: null,
    utm_campaign: null,
  } as OrderUA;

  beforeEach(async () => {
    const mockOrderRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      updateApproval: jest.fn(),
    };

    const mockShopItemRepository = {
      findById: jest.fn(),
    };

    const mockService = {
      getAll: jest.fn(),
      deleteOrder: jest.fn(),
      createOrder: jest.fn(),
      approveOrder: jest.fn(),
      approveOrderAdmin: jest.fn(),
      findAllByEmail: jest.fn(),
      testEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockService,
        },
        {
          provide: REPOSITORY_TOKENS.ORDER,
          useValue: mockOrderRepository,
        },
        {
          provide: REPOSITORY_TOKENS.SHOP_ITEM_V2,
          useValue: mockShopItemRepository,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder];
      service.getAll.mockResolvedValue(orders);

      const result = await controller.getAllOrders();

      expect(result).toEqual(orders);
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createOrder', () => {
    const createOrderDto: CreateOrderDto = {
      items: [{ id: 'PROD-001', size: 'M', title: 'Test Product' }],
      price: 1000,
      approved: false,
      orderId: 'ORD-001',
      orderType: 'ukraine',
      orderData: {
        email: 'test@example.com',
        fullName: 'John Doe',
        phone: '+1234567890',
        city: 'Kyiv',
        novaPoshta: '12345',
        agreement: true,
        promo: null,
        currency: 'uah',
      },
      promo: null,
    };

    it('should create an order', async () => {
      service.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(service.createOrder).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw HttpException on error', async () => {
      service.createOrder.mockRejectedValue(new BadRequestException('Invalid item'));

      await expect(controller.createOrder(createOrderDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      service.deleteOrder.mockResolvedValue(undefined);

      await controller.deleteOrder({ id: 'ORD-001' });

      expect(service.deleteOrder).toHaveBeenCalledWith('ORD-001');
    });
  });

  describe('findAllByEmail', () => {
    it('should find orders by email', async () => {
      const orders = [mockOrder];
      service.findAllByEmail.mockResolvedValue(orders);

      const result = await controller.findAllByEmail('test@example.com');

      expect(result).toEqual(orders);
      expect(service.findAllByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('testEmail', () => {
    it('should call testEmail service method', () => {
      service.testEmail.mockReturnValue(undefined);

      controller.testEmail();

      expect(service.testEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('approveOrder', () => {
    it('should approve an order', async () => {
      // The controller expects data in format: { "key": "JSON string" }
      // It then parses the JSON string from the first key
      const paymentDataString = JSON.stringify({
        reasonCode: 1100,
        orderReference: 'ORD-001',
      });
      const paymentData = { [paymentDataString]: '' } as any;

      service.approveOrder.mockResolvedValue(mockOrder);

      const result = await controller.approveOrder(paymentData);

      expect(service.approveOrder).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe('approveOrderAdmin', () => {
    it('should approve an order via admin', async () => {
      service.approveOrderAdmin.mockResolvedValue(undefined);

      const result = await controller.approveOrderAdmin({ orderId: 'ORD-001' });

      expect(service.approveOrderAdmin).toHaveBeenCalledWith('ORD-001');
      expect(result).toBeUndefined();
    });
  });
});
