import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/tokens/token.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { CreateGoogleUserDto } from '../users/dto/create-google-user.dto';

export interface JwtPayload {
  username: string;
  email: string;
  sub: string;
}

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  async refreshAccessToken(refreshToken: string) {
    const originalRefreshToken =
      this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (
      !originalRefreshToken ||
      !tokenFromDb ||
      tokenFromDb.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Expired refresh token');
    }

    const payload: JwtPayload = {
      email: tokenFromDb.user.email,
      username: tokenFromDb.user.username,
      sub: tokenFromDb.user.id,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    return { access_token };
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Login or password invalid');
    }

    const payload: JwtPayload = {
      email: user.email,
      username: user.username,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refresh_token = this.tokenService.generateRefreshToken();
    const refresh_token_signed = this.jwtService.sign(
      { refresh_token },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      },
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.tokenService.storeRefreshToken(
      user,
      refresh_token_signed,
      access_token,
      expiresAt,
    );

    return { access_token, refresh_token: refresh_token_signed };
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const newUser = await this.userRepository.findOne({ where: { email } });

    if (newUser) {
      throw new BadRequestException(`User with such ${email} alredy exists`);
    }

    const hashPassword = await bcrypt.hash(password, 4);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
    return this.userRepository.save(user);
  }

  async signOut(refreshToken: string) {
    try {
      await this.tokenService.deleteToken(refreshToken);
      return 'Logged out successfully';
    } catch {
      throw new BadRequestException('Error invalidating refresh token');
    }
  }

  async validateGoogleUser(googleUser: CreateGoogleUserDto) {
    const user = await this.usersService.findByEmail(googleUser.email);
    console.log('user', user);
    if (user) return user;
    return await this.usersService.create(googleUser);
  }
}
