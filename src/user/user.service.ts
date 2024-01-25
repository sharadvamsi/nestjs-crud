// user.service.ts

import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,

  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }



  async createUser(username: string, email: string, password: string, profileImage?: string) {
    try {
      const existingUserByUsername = await this.userModel.findOne({ username });
      

      if (existingUserByUsername) {
        return ('Username already exists');
      }

      const existingUserByEmail = await this.userModel.findOne({ email });
      

      if (existingUserByEmail) {
        //throw new UnauthorizedException('Email already exists');
        return  'Email already exists'
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ username, email, password: hashedPassword, profileImage });
      const savedUser = await user.save();

      return `User ${user.username} has Created Successfully`;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  
  
      






    

  async getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    try {
      
      
      const user = await this.userModel.findOne({ username });
      


    if (!user) {
      throw new UnauthorizedException('User doesnt exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

   

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
    } catch (error) {
      return error;
      
    }

    
  }

  async generateJwtToken(user: User): Promise<string> {
    // console.log(user)
    const payload = { username: user.username, sub: user._id };
    return jwt.sign(payload, 'secretKey', { expiresIn: '1h' });
  }

  async updateUser(username: string, email?: string, password?: string, profileImage?: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { username },
      { email, ...(password && { password: await bcrypt.hash(password, 10) }), profileImage },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(username: string): Promise<void> {
    const result = await this.userModel.deleteOne({ username });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
