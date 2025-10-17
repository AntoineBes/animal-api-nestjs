import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PrismaService', () => {
    let service: PrismaService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [PrismaService],
      }).compile();

      service = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('calls $connect when onModuleInit is invoked', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined);
      await service.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
      connectSpy.mockRestore();
    });

    it('calls $disconnect when onModuleDestroy is invoked', async () => {
      const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue(undefined);
      await service.onModuleDestroy();
      expect(disconnectSpy).toHaveBeenCalled();
      disconnectSpy.mockRestore();
    });

    it('registers SIGINT and SIGTERM handlers and runs shutdown (disconnect + app.close) when signaled', async () => {
      const callbacks: Record<string, (...args: any[]) => void> = {};
      const onSpy = jest.spyOn(process, 'on').mockImplementation(((
        event: string,
        cb: (...args: any[]) => void,
      ) => {
        callbacks[event] = cb;
        return process;
      }) as any);

      const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue(undefined);
      const app = { close: jest.fn().mockResolvedValue(undefined) };

      service.enableShutdownHooks(app as any);

      expect(onSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
      expect(onSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));

      callbacks['SIGINT']();
      await new Promise((resolve) => setImmediate(resolve));

      expect(disconnectSpy).toHaveBeenCalled();
      expect(app.close).toHaveBeenCalled();

      onSpy.mockRestore();
      disconnectSpy.mockRestore();
    });
  });
});
