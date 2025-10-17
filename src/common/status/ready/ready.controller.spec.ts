import { Test, TestingModule } from '@nestjs/testing';
import { ReadyController } from './ready.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';

describe('ReadyController (unit)', () => {
  let controller: ReadyController;
  let prismaMock: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prismaMock = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadyController],
      providers: [{ provide: PrismaService, useValue: prismaMock }],
    }).compile();

    controller = module.get<ReadyController>(ReadyController);
  });

  it('should return {status: "ready"} when DB ping succeeds', async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce([{ '1': 1 }]);

    const res = await controller.ready();
    expect(res).toEqual({ status: 'ready' });
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('should throw 503 when DB ping fails', async () => {
    prismaMock.$queryRaw.mockRejectedValueOnce(new Error('DB down'));

    await expect(controller.ready()).rejects.toMatchObject({
      response: { status: 'not-ready' },
      status: HttpStatus.SERVICE_UNAVAILABLE,
    });
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
  });
});
