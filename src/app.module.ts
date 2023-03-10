import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import { ComputeModule } from './compute/compute.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    StorageModule,
    ComputeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
