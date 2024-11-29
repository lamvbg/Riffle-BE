import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './cores/core.module';
import { ServerModule } from './features/server/server.module';
import { ProfileModule } from './features/profile/profile.module';
import { LiveStreamingModule } from './features/gateway/live-streaming/live-streaming.module';
import { ChannelModule } from './features/channel/channel.module';
import { MemberModule } from './features/member/member.module';
import { MessageModule } from './features/message/message.module';
import { ChatModule } from './features/gateway/chat/chat.module';
import { AuthModule } from './features/auth/auth.module';
import { SettingModule } from './features/setting/setting.module';
import { NotificationModule } from './features/gateway/notification/notification.module';
import { CloudinaryModule } from './features/cloudinary/cloudinary.module';


@Module({
  imports: [
    CoreModule,
    ServerModule,
    ProfileModule,
    LiveStreamingModule,
    ChannelModule,
    MemberModule,
    MessageModule,
    ChatModule,
    ConfigModule.forRoot(),
    AuthModule,
    SettingModule,
    NotificationModule,
    CloudinaryModule,
  ],
  controllers: [],
})
export class AppModule {}
