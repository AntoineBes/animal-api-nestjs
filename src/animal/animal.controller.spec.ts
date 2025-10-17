import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { BadRequestException } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { StatutUICN } from '@prisma/client';

describe('AnimalController', () => {
  let controller: AnimalController;
  let mockService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimalController],
      providers: [{ provide: AnimalService, useValue: mockService }],
    }).compile();

    controller = module.get<AnimalController>(AnimalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create and return its result', async () => {
    const dto = { nom: 'Tigre', especeId: 1 };
    const created = { id: 1, ...dto };
    mockService.create.mockResolvedValueOnce(created);

    await expect(controller.create(dto as any)).resolves.toEqual(created);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll should parse especeId and normalize statutUICN then call service.findAll', async () => {
    const result = [{ id: 1, nom: 'Tigre' }];
    mockService.findAll.mockResolvedValueOnce(result);

    const returned = await controller.findAll(
      '2', // especeId
      'en', // statutUICN
      'Carnivora',
      'Felidae',
      'Panthera',
      'tigre',
    );

    expect(mockService.findAll).toHaveBeenCalledWith({
      especeId: 2,
      statutUICN: StatutUICN.EN,
      ordre: 'Carnivora',
      famille: 'Felidae',
      genre: 'Panthera',
      q: 'tigre',
    });
    expect(returned).toEqual(result);
  });

  it('findAll should throw BadRequestException for non-integer especeId', () => {
    expect(() => controller.findAll('not-an-int')).toThrow(BadRequestException);
  });

  it('findAll should throw BadRequestException for invalid statutUICN', () => {
    expect(() => controller.findAll(undefined, 'ZZ')).toThrow(BadRequestException);
  });

  it('findOne should call service.findOne with numeric id', async () => {
    const animal = { id: 5, nom: 'Panda' };
    mockService.findOne.mockResolvedValueOnce(animal);

    const returned = await controller.findOne(5);
    expect(mockService.findOne).toHaveBeenCalledWith(5);
    expect(returned).toEqual(animal);
  });

  it('update should call service.update and return its result', async () => {
    const dto = { nom: 'Panda Géant' };
    const updated = { id: 5, ...dto };
    mockService.update.mockResolvedValueOnce(updated);

    const returned = await controller.update(5, dto as any);
    expect(mockService.update).toHaveBeenCalledWith(5, dto);
    expect(returned).toEqual(updated);
  });

  it('remove should call service.remove and return its result', async () => {
    const removed = { id: 5, nom: 'Panda' };
    mockService.remove.mockResolvedValueOnce(removed);

    const returned = await controller.remove(5);
    expect(mockService.remove).toHaveBeenCalledWith(5);
    expect(returned).toEqual(removed);
  });
});
