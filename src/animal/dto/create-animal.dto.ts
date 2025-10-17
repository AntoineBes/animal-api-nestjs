import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 1) Liste des valeurs autorisées (runtime-safe)
export const STATUT_UICN_VALUES = ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'] as const;
export type StatutUICNType = (typeof STATUT_UICN_VALUES)[number];

export class CreateAnimalDto {
  @ApiProperty({ example: 'Tigre' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nom!: string;

  @ApiProperty({ example: 1, description: "ID de l'espèce" })
  @IsInt()
  especeId!: number;

  @ApiPropertyOptional({ enum: STATUT_UICN_VALUES, example: 'EN' })
  @IsIn(STATUT_UICN_VALUES)
  @IsOptional()
  statutUICN?: StatutUICNType;

  @ApiPropertyOptional({ example: 'Animalia' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  regne?: string;

  @ApiPropertyOptional({ example: 'Chordata' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  embranchement?: string;

  @ApiPropertyOptional({ example: 'Mammalia' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  classe?: string;

  @ApiPropertyOptional({ example: 'Carnivora' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  ordre?: string;

  @ApiPropertyOptional({ example: 'Felidae' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  famille?: string;

  @ApiPropertyOptional({ example: 'Panthera' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  genre?: string;

  @ApiPropertyOptional({ example: 'https://exemple.com/tigre.jpg' })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: "Grand félin d'Asie." })
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;
}

export class UpdateAnimalDto {
  @ApiPropertyOptional({ example: 'Tigre de Sibérie' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  nom?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  especeId?: number;

  @ApiPropertyOptional({ enum: STATUT_UICN_VALUES, example: 'LC' })
  @IsIn(STATUT_UICN_VALUES)
  @IsOptional()
  statutUICN?: StatutUICNType;

  @ApiPropertyOptional({ example: 'Animalia' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  regne?: string;

  @ApiPropertyOptional({ example: 'Chordata' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  embranchement?: string;

  @ApiPropertyOptional({ example: 'Mammalia' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  classe?: string;

  @ApiPropertyOptional({ example: 'Carnivora' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  ordre?: string;

  @ApiPropertyOptional({ example: 'Felidae' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  famille?: string;

  @ApiPropertyOptional({ example: 'Panthera' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  genre?: string;

  @ApiPropertyOptional({ example: 'https://exemple.com/tigre.jpg' })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'Mise à jour de la description.' })
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;
}
