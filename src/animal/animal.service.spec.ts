/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AnimalService } from './animal.service';
import { StatutUICN } from '@prisma/client';

describe('AnimalService.findAll', () => {
  let mockPrisma: any;
  let service: AnimalService;

  beforeEach(() => {
    mockPrisma = {
      animal: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };
    service = new AnimalService(mockPrisma);
  });

  it('calls prisma.findMany with empty where when no params provided', async () => {
    await service.findAll();

    expect(mockPrisma.animal.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
      where: {},
      include: { espece: true },
      orderBy: { nom: 'asc' },
    });
  });

  it('applies q filter as OR contains for nom and description', async () => {
    (mockPrisma.animal.findMany as jest.Mock).mockResolvedValueOnce([]);
    const q = 'lion';

    await service.findAll({ q });

    expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ nom: { contains: q } }, { description: { contains: q } }],
      },
      include: { espece: true },
      orderBy: { nom: 'asc' },
    });
  });

  it('applies a valid statutUICN filter when a valid enum value is provided', async () => {
    const validStatut = Object.values(StatutUICN)[0] as string;
    await service.findAll({ statutUICN: validStatut });

    expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
      where: {
        statutUICN: validStatut,
      },
      include: { espece: true },
      orderBy: { nom: 'asc' },
    });
  });

  it('ignores an invalid statutUICN value', async () => {
    await service.findAll({ statutUICN: 'INVALID_STATUT' });

    expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
      where: {},
      include: { espece: true },
      orderBy: { nom: 'asc' },
    });
  });

  it('applies multiple filters together (especeId, ordre, famille, genre, q)', async () => {
    const params = {
      especeId: 42,
      ordre: 'Carnivora',
      famille: 'Felidae',
      genre: 'Panthera',
      q: 'tigris',
    };

    await service.findAll(params);

    expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
      where: {
        especeId: params.especeId,
        ordre: params.ordre,
        famille: params.famille,
        genre: params.genre,
        OR: [{ nom: { contains: params.q } }, { description: { contains: params.q } }],
      },
      include: { espece: true },
      orderBy: { nom: 'asc' },
    });
  });
});
