import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
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

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule,
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
      ], // Import the AppModule to test its setup
    }).compile();
  });

  it('should compile successfully', () => {
    expect(appModule).toBeDefined();
  });

  it('should have the core modules imported', () => {
    const coreModule = appModule.get(CoreModule);
    expect(coreModule).toBeDefined();
  });

  it('should have the server module imported', () => {
    const serverModule = appModule.get(ServerModule);
    expect(serverModule).toBeDefined();
  });

  it('should have the profile module imported', () => {
    const profileModule = appModule.get(ProfileModule);
    expect(profileModule).toBeDefined();
  });

  it('should have the live streaming module imported', () => {
    const liveStreamingModule = appModule.get(LiveStreamingModule);
    expect(liveStreamingModule).toBeDefined();
  });

  it('should have the channel module imported', () => {
    const channelModule = appModule.get(ChannelModule);
    expect(channelModule).toBeDefined();
  });

  it('should have the member module imported', () => {
    const memberModule = appModule.get(MemberModule);
    expect(memberModule).toBeDefined();
  });

  it('should have the message module imported', () => {
    const messageModule = appModule.get(MessageModule);
    expect(messageModule).toBeDefined();
  });

  it('should have the chat module imported', () => {
    const chatModule = appModule.get(ChatModule);
    expect(chatModule).toBeDefined();
  });

  it('should have the auth module imported', () => {
    const authModule = appModule.get(AuthModule);
    expect(authModule).toBeDefined();
  });

  it('should have the setting module imported', () => {
    const settingModule = appModule.get(SettingModule);
    expect(settingModule).toBeDefined();
  });

  it('should have the notification module imported', () => {
    const notificationModule = appModule.get(NotificationModule);
    expect(notificationModule).toBeDefined();
  });

  it('should have the cloudinary module imported', () => {
    const cloudinaryModule = appModule.get(CloudinaryModule);
    expect(cloudinaryModule).toBeDefined();
  });
});
