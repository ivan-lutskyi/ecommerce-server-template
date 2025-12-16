import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { sendSupportEmail } from '../utils/sendEmail';
import { SupportRequestDto } from './dto/supportReq.dto';

@Controller('support')
export class SupportController {
  @Post()
  @HttpCode(HttpStatus.OK)
  sendSupportRequest(@Body() supportRequest: SupportRequestDto) {
    try {
      const { email, fullname, message } = supportRequest;
      if (!email || !fullname || !message) {
        throw new Error();
      }

      sendSupportEmail(email, fullname, message);
    } catch (error) {
      throw new HttpException(
        'Something goes wrong. Try again later',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
