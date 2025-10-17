import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEspeceDto, UpdateEspeceDto } from './dto/create-espece.dto';

@Injectable()
export class EspeceService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateEspeceDto) {
    return this.prisma.espece.create({ data });
  }
  findAll() {
    return this.prisma.espece.findMany({ orderBy: { nom: 'asc' } });
  }
  async findOne(id: number) {
    const item = await this.prisma.espece.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Espece not found');
    return item;
  }
  async update(id: number, data: UpdateEspeceDto) {
    await this.findOne(id);
    return this.prisma.espece.update({ where: { id }, data });
  }
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.espece.delete({ where: { id } });
  }
}
