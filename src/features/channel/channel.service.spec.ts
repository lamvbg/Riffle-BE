import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { ChannelRepository } from '../../cores/repositories/channel.repository';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { ProfileService } from '../profile/profile.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

// Mocked dependencies
const mockChannelRepository = {
  get: jest.fn(),
  getOne: jest.fn(),
  updateUser: jest.fn(),
};

const mockServerRepository = {
  updateUser: jest.fn(),
};

const mockProfileService = {
  getProfileById: jest.fn(),
};

describe('ChannelService', () => {
  let service: ChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        { provide: ChannelRepository, useValue: mockChannelRepository },
        { provide: ServerRepository, useValue: mockServerRepository },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
  });

  describe('createChannel', () => {
    it('should throw UnauthorizedException if profile does not exist', async () => {
        mockProfileService.getProfileById.mockResolvedValue(null);
      
        await expect(
          service.createChannel('serverId', 'profileId', { name: 'test', type: 'TEXT' }),
        ).rejects.toThrow(UnauthorizedException);  // Kiểm tra UnauthorizedException ở đây
      });
      

      it('should throw BadRequestException if serverId is missing', async () => {
        mockProfileService.getProfileById.mockResolvedValue({ id: 'profileId' });
        await expect(
          service.createChannel('', 'profileId', { name: 'test', type: 'TEXT' }),
        ).rejects.toThrow('Server ID missing');
      });
      
      
      

    it('should throw BadRequestException if name is "general"', async () => {
      await expect(
        service.createChannel('serverId', 'profileId', { name: 'general', type: 'TEXT' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully create a channel', async () => {
        mockProfileService.getProfileById.mockResolvedValue({ id: 'profileId' });
        mockServerRepository.updateUser.mockResolvedValue({});
      
        const result = await service.createChannel('serverId', 'profileId', { name: 'test', type: 'TEXT' });
      
        expect(result).toBeDefined();
        expect(mockServerRepository.updateUser).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              id: 'serverId',
              members: {
                some: {
                  profileId: 'profileId',
                  role: { in: ['ADMIN', 'MODERATOR'] },
                },
              },
            },
            data: expect.objectContaining({
              channels: {
                create: expect.objectContaining({
                  name: 'test',
                  type: 'TEXT',
                  profileId: 'profileId', // Thêm profileId nếu cần
                }),
              },
            }),
          }),
        );
      });      
  });

  describe('getChannelById', () => {
    it('should return the channel details', async () => {
      const mockChannel = { id: 'channelId', name: 'test', messages: [] };
      mockChannelRepository.getOne.mockResolvedValue(mockChannel);

      const result = await service.getChannelById('channelId');
      expect(result).toEqual(mockChannel);
    });
  });

  describe('getAllChannels', () => {
    it('should return all channels with pagination', async () => {
      const mockChannels = [{ id: 'channel1' }, { id: 'channel2' }];
      mockChannelRepository.get.mockResolvedValue(mockChannels);

      const result = await service.getAllChannels({ pagination: { skip: 0, take: 10 } });
      expect(result).toEqual(mockChannels);
    });
  });

  describe('updateChannel', () => {
    it('should update channel data', async () => {
      const mockUpdatedChannel = { id: 'channelId', name: 'updatedName' };
      mockChannelRepository.updateUser.mockResolvedValue(mockUpdatedChannel);

      const result = await service.updateChannel('serverId', 'profileId', 'channelId', { name: 'updatedName' });
      expect(result).toEqual(mockUpdatedChannel);
      expect(mockChannelRepository.updateUser).toHaveBeenCalled();
    });
  });

  describe('deleteChannel', () => {
    it('should throw UnauthorizedException if profile does not exist', async () => {
      mockProfileService.getProfileById.mockResolvedValue(null);

      await expect(service.deleteChannel('serverId', 'profileId', 'channelId')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if serverId is missing', async () => {
        mockProfileService.getProfileById.mockResolvedValue({ id: 'profileId' });
      
        await expect(service.deleteChannel('', 'profileId', 'channelId')).rejects.toThrow(BadRequestException);
      });
      

      it('should delete the channel successfully', async () => {
        mockProfileService.getProfileById.mockResolvedValue({ id: 'profileId' });
        mockServerRepository.updateUser.mockResolvedValue({});
      
        const result = await service.deleteChannel('serverId', 'profileId', 'channelId');
        expect(result).toBeDefined();
        expect(mockServerRepository.updateUser).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { 
              id: 'serverId',
              members: {
                some: {
                  profileId: 'profileId',
                  role: { in: ['ADMIN', 'MODERATOR'] },
                },
              },
            },
            data: expect.objectContaining({
              channels: {
                delete: {
                  id: 'channelId',
                  name: { not: 'general' },
                },
              },
            }),
          }),
        );
      });
  });      
});
