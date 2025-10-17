import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto, UpdateAnimalDto } from './dto/create-animal.dto';
import { StatutUICN } from '@prisma/client';
import { STATUT_UICN_VALUES } from './dto/create-animal.dto';

function toPrismaStatut(val?: string): StatutUICN | undefined {
  if (!val) return undefined;
  const u = val.toUpperCase();
  return (STATUT_UICN_VALUES as readonly string[]).includes(u) ? (u as StatutUICN) : undefined;
}

@Injectable()
export class AnimalService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateAnimalDto) {
    return this.prisma.animal.create({ data });
  }

  findAll(params?: {
    especeId?: number;
    statutUICN?: string;
    ordre?: string;
    famille?: string;
    genre?: string;
    q?: string;
  }) {
    const { especeId, ordre, famille, genre, q } = params || {};
    const statutFilter = toPrismaStatut(params?.statutUICN);
    return this.prisma.animal.findMany({
      where: {
        ...(especeId ? { especeId } : {}),
        ...(statutFilter ? { statutUICN: statutFilter } : {}),
        ...(ordre ? { ordre } : {}),
        ...(famille ? { famille } : {}),
        ...(genre ? { genre } : {}),
        ...(q
          ? {
              OR: [{ nom: { contains: q } }, { description: { contains: q } }],
            }
          : {}),
      },
      include: { espece: true },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.animal.findUnique({
      where: { id },
      include: { espece: true },
    });
    if (!item) throw new NotFoundException('Animal not found');
    return item;
  }

  async update(id: number, data: UpdateAnimalDto) {
    await this.findOne(id);
    return this.prisma.animal.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.animal.delete({ where: { id } });
  }
}
