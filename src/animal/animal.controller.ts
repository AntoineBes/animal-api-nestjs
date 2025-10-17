import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto, UpdateAnimalDto } from './dto/create-animal.dto';
import { StatutUICN } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiCreatedResponse,
} from '@nestjs/swagger';

function parseIntOrUndefined(value?: string): number | undefined {
  if (value === undefined) return undefined;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) {
    throw new BadRequestException('especeId doit être un entier');
  }
  return n;
}

@ApiTags('animaux')
@Controller('animaux')
export class AnimalController {
  constructor(private readonly service: AnimalService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un animal' })
  @ApiCreatedResponse({
    description: 'Animal créé avec succès',
    schema: {
      example: {
        id: 1,
        nom: 'Tigre',
        especeId: 1,
        statutUICN: 'EN',
        ordre: 'Carnivora',
        famille: 'Felidae',
        genre: 'Panthera',
        imageUrl: 'https://exemple.com/tigre.jpg',
        description: "Grand félin d'Asie.",
        createdAt: '2025-10-09T10:00:00.000Z',
        updatedAt: '2025-10-09T10:00:00.000Z',
        espece: { id: 1, nom: 'Mammifère' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Payload invalide' })
  create(@Body() dto: CreateAnimalDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les animaux (filtres facultatifs)' })
  @ApiQuery({ name: 'especeId', required: false, type: Number, description: "ID de l'espèce" })
  @ApiQuery({
    name: 'statutUICN',
    required: false,
    enum: StatutUICN,
    description: 'Statut UICN (EX, EW, CR, EN, VU, NT, LC, DD, NE)',
  })
  @ApiQuery({ name: 'ordre', required: false, type: String })
  @ApiQuery({ name: 'famille', required: false, type: String })
  @ApiQuery({ name: 'genre', required: false, type: String })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Recherche texte (nom/description)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des animaux renvoyée',
    schema: {
      example: [
        {
          id: 1,
          nom: 'Tigre',
          especeId: 1,
          statutUICN: 'EN',
          ordre: 'Carnivora',
          famille: 'Felidae',
          genre: 'Panthera',
          imageUrl: 'https://exemple.com/tigre.jpg',
          description: "Grand félin d'Asie.",
          createdAt: '2025-10-09T10:00:00.000Z',
          updatedAt: '2025-10-09T10:00:00.000Z',
          espece: { id: 1, nom: 'Mammifère' },
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Paramètres de recherche invalides' })
  findAll(
    @Query('especeId') especeId?: string,
    @Query('statutUICN') statutUICN?: string,
    @Query('ordre') ordre?: string,
    @Query('famille') famille?: string,
    @Query('genre') genre?: string,
    @Query('q') q?: string,
  ) {
    const especeIdNum = parseIntOrUndefined(especeId);

    const statutNorm = statutUICN?.toUpperCase();
    if (statutNorm && !Object.values(StatutUICN).includes(statutNorm as StatutUICN)) {
      throw new BadRequestException('statutUICN invalide');
    }

    return this.service.findAll({
      especeId: especeIdNum,
      statutUICN: statutNorm,
      ordre,
      famille,
      genre,
      q,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un animal par ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({ name: 'especeId', required: false, type: Number, description: "ID de l'espèce" })
  @ApiQuery({ name: 'statutUICN', required: false, enum: StatutUICN })
  @ApiQuery({ name: 'ordre', required: false, type: String })
  @ApiQuery({ name: 'famille', required: false, type: String })
  @ApiQuery({ name: 'genre', required: false, type: String })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Recherche (nom/description)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'nom',
    description: 'nom|createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    example: 'asc',
    description: 'asc|desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultats paginés',
    schema: {
      example: {
        data: [
          {
            id: 1,
            nom: 'Tigre',
            especeId: 1,
            statutUICN: 'EN',
            ordre: 'Carnivora',
            famille: 'Felidae',
            genre: 'Panthera',
            imageUrl: 'https://exemple.com/tigre.jpg',
            description: "Grand félin d'Asie.",
            createdAt: '2025-10-09T10:00:00.000Z',
            updatedAt: '2025-10-09T10:00:00.000Z',
            espece: { id: 1, nom: 'Mammifère' },
          },
        ],
        page: 1,
        pageSize: 10,
        total: 5,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'ID invalide' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un animal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Animal mis à jour',
    schema: {
      example: {
        id: 1,
        nom: 'Tigre de Sibérie',
        especeId: 1,
        statutUICN: 'EN',
        description: 'Mise à jour',
        updatedAt: '2025-10-09T10:10:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Payload invalide' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnimalDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un animal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Animal supprimé',
    schema: {
      example: {
        id: 1,
        nom: 'Tigre',
        especeId: 1,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'ID invalide' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
