import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { WfpPaymentTransaction } from './dto/wfpPayment.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAllOrders() {
    return this.orderService.getAll();
  }

  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    try {
      return await this.orderService.createOrder(order);
    } catch (error) {
      throw new HttpException('Error', error.status);
    }
  }

  @Post('/email/test')
  testEmail() {
    return this.orderService.testEmail();
  }

  @Post('/approve')
  @HttpCode(HttpStatus.OK)
  approveOrder(@Body() data: WfpPaymentTransaction) {
    const parsedData = JSON.parse(Object.keys(data)[0]);
    console.log('DATA IN CONTROLLER PARSED:', parsedData);

    return this.orderService.approveOrder(parsedData);
  }

  @Post('/approve/admin')
  @HttpCode(HttpStatus.OK)
  approveOrderAdmin(@Body() data: { orderId: string }) {
    return this.orderService.approveOrderAdmin(data.orderId);
  }

  @Post('success')
  @Redirect(process.env.SUCCESS_REDIRECT_URL || 'http://localhost:3000/success', 301)
  successOrder() {
    return { url: process.env.SUCCESS_REDIRECT_URL || 'http://localhost:3000/success' };
  }

  @Delete('/:id')
  deleteOrder(@Param() params: { id: string }) {
    return this.orderService.deleteOrder(params.id);
  }

  @Get('/by-email')
  findAllByEmail(@Query('email') email: string) {
    return this.orderService.findAllByEmail(email);
  }
}
