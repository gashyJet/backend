import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenEntity } from './entities/token.entity';
import * as crypto from 'crypto';
import { UserEntity } from 'src/users/entities/user.entity';

interface DecodedRefreshToken {
  refresh_token: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  validateRefreshToken(token: string) {
    let decodedRefreshToken: DecodedRefreshToken;

    try {
      decodedRefreshToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return decodedRefreshToken.refresh_token;
  }

  async storeRefreshToken(
    user: UserEntity,
    refreshToken: string,
    accessToken: string,
    expiresAt: Date,
  ) {
    const token = this.tokenRepository.create({
      refreshToken,
      accessToken,
      user,
      expiresAt,
    });
    await this.tokenRepository.save(token);
  }

  async findToken(refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException('Token not found or invalid');
    }

    return token;
  }

  async deleteToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);
    await this.tokenRepository.remove(token);
  }
}
