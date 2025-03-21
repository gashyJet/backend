import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'First Name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last Name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
