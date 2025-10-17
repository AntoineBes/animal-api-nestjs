import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EspeceModule } from './espece/espece.module';
import { AnimalModule } from './animal/animal.module';
import { HealthController } from './common/status/health/health.controller';
import { ReadyController } from './common/status/ready/ready.controller';
import { LiveController } from './common/status/live/live.controller';

@Module({
  imports: [PrismaModule, EspeceModule, AnimalModule],
  controllers: [AppController, HealthController, ReadyController, LiveController],
  providers: [AppService],
})
export class AppModule {}
