import { Controller, Get } from '@nestjs/common';

@Controller('live')
export class LiveController {
  @Get()
  live() {
    return { status: 'live' };
  }
}
