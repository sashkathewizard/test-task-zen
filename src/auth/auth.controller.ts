import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common";
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { RefreshGuard } from './gurds/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('sign-in')
  singIn(@Body() authDto: SignInDto) {
    return this.authService.signIn(authDto);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  refresh(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }
}
