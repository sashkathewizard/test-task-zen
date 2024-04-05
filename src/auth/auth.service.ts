import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(data: SignInDto) {
    const user: User = await this.validateUser(data);
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async signUp(data: SignUpDto) {
    data.password = await this.hashPassword(data.password);
    const user: User = await this.userService.create(data);
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  private async validateUser(data: SignInDto) {
    const user: User = await this.userService.findOneByEmail(data.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(data.password, user.password);
      if (passwordEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Invalid email or password' });
  }

  async generateAccessToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '2d' });
  }

  async generateRefreshToken(user: User) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 5);
  }

  async refreshToken(userId: number) {
    const user: User | null = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException(
        { message: 'Invalid id, login again' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      accessToken: await this.generateAccessToken(user),
    };
  }
}
