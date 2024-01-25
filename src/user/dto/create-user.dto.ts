// create-user-with-file.dto.ts

import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Add this import

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  profileImage:string;
}
