import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';

import googleOauthConfig from '../config/google-oauth.config';
import { AuthService } from '../auth.service';

export interface IGoogleProfile {
  photos: {
    value: string;
  }[];
  password: string;
  emails: {
    value: string;
  }[];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clinetID ?? '',
      clientSecret: googleConfiguration.clientSecret ?? '',
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: IGoogleProfile,
    done: VerifyCallback,
  ) {
    console.log({ profile });
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      avatarUrl: profile.photos[0].value,
      password: '',
      username: '',
    });
    done(null, user);
    return user;
  }
}
