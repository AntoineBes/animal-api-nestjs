/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Controller('ready')
export class ReadyController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch (err) {
      throw new HttpException({ status: 'not-ready' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
