import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGoogleUserDto } from 'src/users/dto/create-google-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOne(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async create(createUserDto: CreateGoogleUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
}
