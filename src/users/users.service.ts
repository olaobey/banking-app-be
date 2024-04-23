/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from '../dto/userDto/register.dto';
import { UpdateUserDto } from '../dto/userDto/update-user.dto';
import { User, UserDocument } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { firstName, lastName, email, password } = registerDto;
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password,
    });
    return newUser.save();
  }

  async getUsers(page: number = 1, pageSize: number = 10): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const query = await this.userModel.find().skip(skip).limit(pageSize).exec();
    const total = await this.userModel.countDocuments().exec();
    const users = await query;
    return{ users, total };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userModel.deleteOne({ _id: id }).exec();
    return user;
  }
}
