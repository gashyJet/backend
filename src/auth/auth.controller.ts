import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { COOKIE_MAX_AGE } from 'src/constants/constants';
import { GoogleAuthGuard } from './guards/google-auth.guard';

export interface CustomRequest extends Request {
  user: {
    email: string;
    username: string;
  };
}

@ApiTags('Authentication')
@ApiUnauthorizedResponse({ description: 'Unauthorized response' })
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(@Req() req: CustomRequest) {
    console.log(req.user);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: CustomRequest, @Res() res: Response) {
    const user = req.user;
    const { email } = user;

    if (!email) {
      console.log('Google OAuth callback did not return email');
      return;
    }

    console.log(res.json(user));

    res.json(user);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({
    description: 'The user has been successfully logged in.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ type: UserSignInDto })
  async login(
    @Body() { email, password }: UserSignInDto,
    @Res() res: Response,
  ) {
    try {
      const userData = await this.authService.signIn(email, password);
      res.cookie('refresh_token', userData.refresh_token, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      });
      return res.json({ access_token: userData.access_token });
    } catch {
      throw new BadRequestException(
        'Login failed. Please check your credentials.',
      );
    }
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered & created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User log out' })
  @ApiCreatedResponse({
    description: 'The user has been logged out.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async logout(
    @Body() { refresh_token }: { refresh_token: string },
    @Res() res: Response,
  ) {
    await this.authService.signOut(refresh_token);
    res.clearCookie('refresh_token');
    return res.json({ message: 'Logged out successfully' });
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'refresh access_token' })
  @ApiCreatedResponse({
    description: 'The access token has been successfully refreshed.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async refreshAccessToken(
    @Body() { refresh_token }: { refresh_token: string },
  ) {
    return this.authService.refreshAccessToken(refresh_token);
  }
}
