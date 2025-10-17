import { Module } from '@nestjs/common';
import { EspeceService } from './espece.service';
import { EspeceController } from './espece.controller';

@Module({
  providers: [EspeceService],
  controllers: [EspeceController],
})
export class EspeceModule {}
