import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(data: SignUpDto): Promise<User> {
    const user: User | null = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });
    if (user) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.prismaService.user.create({ data });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOneByEmail(email: string) {
    const user: User | null = await this.prismaService.user.findFirst({
      where: { email: email },
    });
    return user;
  }

  async findOne(id: number): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userExists(id);
    return this.prismaService.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.user.delete({ where: { id: id } });
  }

  async userExists(id: number) {
    if (!(await this.prismaService.user.count({ where: { id } }))) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
  }
}
