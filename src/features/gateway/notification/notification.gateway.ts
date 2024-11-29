import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  afterInit(server: Server) {
    console.log('Notification WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Notification client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Notification client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendNotification')
  async handleSendNotification(
    @MessageBody() data: { profileId: string; message: string; redirectMessage: string, serverId: string },
  ) {
    const notificationData = {
      profile: { connect: { id: data.profileId } },
      server: { connect: { id: data.serverId } },
      message: data.message,
      redirectMessage: data.redirectMessage,
    };

    const notification = await this.notificationService.createNotification(notificationData);
    this.server.to(`profile_${data.profileId}`).emit('receiveNotification', notification);
  }
}