import { Test, TestingModule } from '@nestjs/testing';
import { LiveController } from './live.controller';

describe('LiveController', () => {
  let controller: LiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveController],
    }).compile();

    controller = module.get<LiveController>(LiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return {status:"live"}', () => {
    const c = new LiveController();
    expect(c.live()).toEqual({ status: 'live' });
  });
});
