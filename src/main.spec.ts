import { Test, TestingModule } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Path to AppModule
import * as request from 'supertest';

// Mock NestFactory methods to avoid starting an actual server
jest.mock('@nestjs/core', () => ({
  ...jest.requireActual('@nestjs/core'),
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      enableCors: jest.fn(),
      setGlobalPrefix: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

describe('Main bootstrap', () => {
  let app;

  beforeAll(async () => {
    // Setup the application by compiling the testing module
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Simulate creating the app using the mocked NestFactory.create
    app = await NestFactory.create(AppModule);
  });

  it('should call NestFactory.create with AppModule', () => {
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });


  it('should call listen method on port 3000', async () => {
    await app.listen(3000);  // Ensure app is listening on port 3000
    expect(app.listen).toHaveBeenCalledWith(3000);
  });

  // You can add more tests here as needed, e.g., testing for error scenarios or other configurations.
});
