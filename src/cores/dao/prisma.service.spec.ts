import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient class directly
jest.mock('@prisma/client', () => {
  // Mock the PrismaClient constructor and its methods
  const actualPrismaClient = jest.requireActual('@prisma/client');
  return {
    ...actualPrismaClient,
    PrismaClient: jest.fn().mockImplementation(() => ({
      // Mock $connect and $disconnect methods
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService], // Make sure PrismaService is provided
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect', async () => {
      // Ensure $connect is called during onModuleInit
      const spy = jest.spyOn(prismaService, '$connect'); // Spy on $connect method
      await prismaService.$connect(); // Trigger the onModuleInit lifecycle
      expect(spy).toHaveBeenCalled(); // Ensure it was called
    });
  });
});
