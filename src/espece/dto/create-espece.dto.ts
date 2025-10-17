import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEspeceDto {
  @ApiProperty({ example: 'Mammifère' })
  @IsString()
  @IsNotEmpty()
  nom!: string;
}

export class UpdateEspeceDto {
  @ApiPropertyOptional({ example: 'Mammifères' })
  @IsString()
  @IsOptional()
  nom?: string;
}
