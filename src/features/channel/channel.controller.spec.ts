import { Test, TestingModule } from '@nestjs/testing';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelType } from '@prisma/client';

describe('ChannelController', () => {
  let controller: ChannelController;
  let service: ChannelService;

  // Mock Channel Data
  const mockChannel = {
    id: 'channelId123',
    name: 'General',
    type: ChannelType.TEXT,
    profileId: 'profileId123',
    serverId: 'serverId123',
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: 'https://example.com/image.jpg',
    inviteCode: 'invite123',
  };

  const mockChannels = [
    mockChannel,
    {
      id: 'channelId456',
      name: 'Random',
      type: ChannelType.AUDIO,
      profileId: 'profileId456',
      serverId: 'serverId456',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: 'https://example.com/image2.jpg',
      inviteCode: 'invite456',
    },
  ];

  beforeEach(async () => {
    const mockChannelService = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      getChannelById: jest.fn().mockResolvedValue(mockChannel),
      updateChannel: jest.fn().mockResolvedValue(mockChannel),
      deleteChannel: jest.fn().mockResolvedValue(mockChannel),
      getAllChannels: jest.fn().mockResolvedValue(mockChannels),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
      ],
    }).compile();

    controller = module.get<ChannelController>(ChannelController);
    service = module.get<ChannelService>(ChannelService);
  });

  describe('createChannel', () => {
    it('should create a new channel', async () => {
      const createChannelDto = {
        name: 'General',
        type: ChannelType.TEXT,
      };

      const result = await controller.createChannel('serverId123', 'profileId123', createChannelDto);
      expect(result).toEqual(mockChannel);
      expect(service.createChannel).toHaveBeenCalledWith('serverId123', 'profileId123', createChannelDto);
    });
  });

  describe('getChannelById', () => {
    it('should return a channel by ID', async () => {
      const result = await controller.getChannelById('channelId123');
      expect(result).toEqual(mockChannel);
      expect(service.getChannelById).toHaveBeenCalledWith('channelId123');
    });
  });

  describe('updateChannel', () => {
    it('should update a channel', async () => {
      const updateChannelDto = {
        name: 'Updated General',
        type: ChannelType.TEXT,
      };

      const result = await controller.updateChannel(
        'channelId123',
        'serverId123',
        'profileId123',
        updateChannelDto
      );
      expect(result).toEqual(mockChannel);
      expect(service.updateChannel).toHaveBeenCalledWith(
        'serverId123',
        'profileId123',
        'channelId123',
        updateChannelDto
      );
    });
  });

  describe('deleteChannel', () => {
    it('should delete a channel', async () => {
      const result = await controller.deleteChannel('channelId123', 'serverId123', 'profileId123');
      expect(result).toEqual(mockChannel);
      expect(service.deleteChannel).toHaveBeenCalledWith('serverId123', 'profileId123', 'channelId123');
    });
  });

  describe('getAllChannels', () => {
    it('should return a list of channels', async () => {
      const result = await controller.getAllServers(0, 10, '{"createdAt":"desc"}', '{"type":"TEXT"}');
      expect(result).toEqual(mockChannels);
      expect(service.getAllChannels).toHaveBeenCalledWith({
        pagination: { skip: 0, take: 10 },
        where: { type: 'TEXT' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
