import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { KnowledgeItemsModule } from './knowledge-items/knowledge-items.module';
import { KnowledgeItemsService } from './knowledge-items/knowledge-items.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MyLoggerModule,
    DatabaseModule,
    KnowledgeItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService, KnowledgeItemsService],
})
export class AppModule {}
