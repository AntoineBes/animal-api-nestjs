import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Vérifier la santé du service' })
  @ApiResponse({ status: 200, description: 'OK', schema: { example: { status: 'ok' } } })
  health() {
    return { status: 'ok' };
  }
}
