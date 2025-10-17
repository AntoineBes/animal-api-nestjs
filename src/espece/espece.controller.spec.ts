import { Test, TestingModule } from '@nestjs/testing';
import { EspeceController } from './espece.controller';
import { EspeceService } from './espece.service';

describe('EspeceController', () => {
  let controller: EspeceController;
  let service: { findAll: jest.Mock };

  beforeEach(async () => {
    const mockService = { findAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspeceController],
      providers: [{ provide: EspeceService, useValue: mockService }],
    }).compile();

    controller = module.get<EspeceController>(EspeceController);
    service = module.get(EspeceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return a list of species', async () => {
    const expected = [{ id: 1, nom: 'Mammifère' }];
    service.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findAll should return an empty array when no species', async () => {
    const expected: any[] = [];
    service.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();
    expect(result).toEqual(expected);
    expect(service.findAll).toHaveBeenCalled();
  });
});
