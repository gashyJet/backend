import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGoogleUserDto {
  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Avatar profile' })
  @IsString()
  @IsNotEmpty()
  avatarUrl: string;
}
