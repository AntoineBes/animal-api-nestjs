/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NotFoundException } from '@nestjs/common';
import { EspeceService } from './espece.service';

describe('EspeceService.remove', () => {
  let service: EspeceService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      espece: {
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    service = new EspeceService(mockPrisma);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete and return the record when it exists', async () => {
    const id = 1;
    const record = { id, nom: 'Lion' };

    mockPrisma.espece.findUnique.mockResolvedValue(record);
    mockPrisma.espece.delete.mockResolvedValue(record);

    const result = await service.remove(id);

    expect(mockPrisma.espece.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(mockPrisma.espece.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(record);
  });

  it('should throw NotFoundException when the record does not exist', async () => {
    const id = 2;

    mockPrisma.espece.findUnique.mockResolvedValue(null);

    await expect(service.remove(id)).rejects.toBeInstanceOf(NotFoundException);
    expect(mockPrisma.espece.delete).not.toHaveBeenCalled();
  });
});
