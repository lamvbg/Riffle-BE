import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from '../../../features/auth/auth.service';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private roomMembers: Map<string, Set<string>> = new Map();

  private roomStreams: Map<string, Set<string>> = new Map(); // roomId -> streamIds
  private streamOwners: Map<string, string> = new Map(); // streamId -> clientId

  constructor(
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {
    // Xóa các luồng thuộc client rời phòng
    const streamsToDelete = Array.from(this.streamOwners.entries())
      .filter(([_, owner]) => owner === client.id)
      .map(([streamId]) => streamId);

    streamsToDelete.forEach((streamId) => {
      const roomId = Array.from(this.roomStreams.keys()).find((room) =>
        this.roomStreams.get(room)?.has(streamId),
      );
      if (roomId) {
        this.roomStreams.get(roomId)?.delete(streamId);
        this.server.to(roomId).emit('streamRemoved', { streamId });
      }
      this.streamOwners.delete(streamId);
    });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    data: { channelId: string; memberId: string; role?: string },
  ) {
    const roomName = `channel_${data.channelId}`;
    client.join(roomName);
  
    if (!this.roomMembers.has(roomName)) {
      this.roomMembers.set(roomName, new Set());
    }
  
    const members = this.roomMembers.get(roomName);
    members.add(data.memberId);
  
    const role = 'viewer'; // Default role
  
    try {
      const token = await this.authService.generateHmsToken(roomName, data.memberId, role);
  
      // Emit token back to client
      client.emit('100msToken', { token });
    } catch (error) {
      console.error('Error generating token:', error.message);
      client.emit('error', { message: 'Failed to generate token' });
      return;
    }
  
    const memberDetails = await this.chatService.getMemberDetails(Array.from(members));
  
    // Update room members for all clients
    this.server.to(roomName).emit('updateRoomMembers', memberDetails);
  }
  
  

  @SubscribeMessage('leaveRoom')
async handleLeaveRoom(
  client: Socket,
  data: { channelId: string; memberId: string },
) {
  const roomName = `channel_${data.channelId}`;
  client.leave(roomName);

  if (this.roomMembers.has(roomName)) {
    const members = this.roomMembers.get(roomName);
    members.delete(data.memberId);

    const memberDetails = await this.chatService.getMemberDetails(
      Array.from(members),
    );
    this.server.to(roomName).emit('updateRoomMembers', memberDetails);

    if (members.size === 0) {
      this.roomMembers.delete(roomName);
    }
  }
}


  @SubscribeMessage('sendChannelMessage')
  async handleSendChannelMessage(
    @MessageBody()
    data: {
      memberId: string;
      channelId: string;
      content: string;
      fileUrl?: string;
    },
  ) {
    const message = await this.chatService.saveChannelMessage(data);
    this.server
      .to(`channel_${data.channelId}`)
      .emit('receiveChannelMessage', message);
  }

  @SubscribeMessage('sendDirectMessage')
  async handleSendDirectMessage(
    @MessageBody()
    data: {
      memberId: string;
      conversationId: string;
      content: string;
      fileUrl?: string;
    },
  ) {
    const directMessage = await this.chatService.saveDirectMessage(data);
    this.server
      .to(`conversation_${data.conversationId}`)
      .emit('receiveDirectMessage', directMessage);
  }

  @SubscribeMessage('sendNotification')
  async handleSendNotification(
    @MessageBody()
    data: {
      profileId: string;
      message: string;
      redirectMessage: string;
      fileUrl?: string;
      serverId: string;
    },
  ) {
    const notificationData = {
      profile: { connect: { id: data.profileId } },
      server: { connect: { id: data.serverId } },
      message: data.message,
      redirectMessage: data.redirectMessage,
    };

    const notification =
      await this.notificationService.createNotification(notificationData);
    this.server
      .to(`profile_${data.profileId}`)
      .emit('receiveNotification', notification);
  }
}
