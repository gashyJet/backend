import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
  @ApiProperty({
    example: 'userName',
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
