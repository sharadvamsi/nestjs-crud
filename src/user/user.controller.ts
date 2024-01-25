// user.controller.ts

import { Controller, Post, Body, Get, Patch, Param, Delete, NotFoundException, UnauthorizedException, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidationPipeWithClassValidator } from './dto/validation.pipe';
import { JwtAuthGuard } from './dto/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return { users };
  }

  @Get(':username')
  async getUserByUsernameFromBody(@Param('username') username: string) {
    try {
      const user = await this.userService.getUserByUsername(username);
      return { user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  @Post('register')
  @UsePipes(new ValidationPipeWithClassValidator())
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const { username, email, password, profileImage } = createUserDto;
      const user = await this.userService.createUser(username, email, password, profileImage);
      return { user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipeWithClassValidator())
  async loginUser(@Body() loginUserDto: LoginUserDto, token:string) {
    try {
      const { username, password } = loginUserDto;
      const user = await this.userService.getUserByUsernameAndPassword(username, password);
      const token = await this.userService.generateJwtToken(user);
      return { token};
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Patch(':username')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const { email, password, profileImage } = updateUserDto;
      const user = await this.userService.updateUser(username, email, password, profileImage);
      return { user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('username') username: string) {
    try {
      await this.userService.deleteUser(username);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
