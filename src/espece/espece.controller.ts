import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EspeceService } from './espece.service';
import { CreateEspeceDto, UpdateEspeceDto } from './dto/create-espece.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('especes')
@Controller('especes')
export class EspeceController {
  constructor(private readonly service: EspeceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une espèce' })
  @ApiCreatedResponse({
    description: 'Espèce créée avec succès',
    schema: {
      example: { id: 1, nom: 'Mammifère' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Payload invalide (ex: "nom" manquant ou vide)',
  })
  create(@Body() dto: CreateEspeceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les espèces' })
  @ApiResponse({
    status: 200,
    description: 'Liste des espèces renvoyée',
    schema: {
      example: [
        { id: 1, nom: 'Mammifère' },
        { id: 2, nom: 'Oiseau' },
      ],
    },
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une espèce par ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Espèce trouvée',
    schema: { example: { id: 1, nom: 'Mammifère' } },
  })
  @ApiBadRequestResponse({ description: 'ID invalide' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une espèce' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Espèce mise à jour',
    schema: { example: { id: 1, nom: 'Mammifères' } },
  })
  @ApiBadRequestResponse({
    description: 'Payload ou ID invalide',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEspeceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une espèce' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Espèce supprimée',
    schema: { example: { id: 1, nom: 'Mammifère' } },
  })
  @ApiBadRequestResponse({ description: 'ID invalide' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
