import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserEntity } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenEntity } from 'src/tokens/entities/token.entity';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/tokens/token.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import googleOauthConfig from './config/google-oauth.config';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    TokenModule,
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
