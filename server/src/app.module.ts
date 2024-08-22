import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigOptions } from './config/env/env.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(ConfigOptions), DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
