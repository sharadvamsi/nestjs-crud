// app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule  .forRoot(), // Load environment variables
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
  ],
})
export class AppModule {}
