import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import * as bcrypt from 'bcryptjs';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string }> {
    const user = await this.validateUser(createUserDto);
    return this.generateToken(user);
  }

  async getUser({ token }: TokenDto): Promise<User> {
    if (!token)
      throw new UnauthorizedException({
        message: 'Неверный токен',
      });

    const decoded = await this.jwtService.verify(token);

    if (!decoded)
      throw new UnauthorizedException({
        message: 'Неверный токен',
      });

    const userId = decoded.id;
    return await this.userService.findOne(userId);
  }

  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string }> {
    const candidate = await this.userService.getUserByLogin(
      createUserDto.login,
    );
    if (candidate)
      throw new BadRequestException(
        `Пользователь с логином ${createUserDto.login} уже существует`,
      );
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User): Promise<{ token: string }> {
    try {
      const payload = {
        login: user.login,
        id: user.id,
      };
      const token = this.jwtService.sign(payload, { expiresIn: '1d' });
      return { token };
    } catch (e) {
      throw new HttpException('Невозможно создать токен', 500);
    }
  }

  private async validateUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.getUserByLogin(createUserDto.login);

    const error = new UnauthorizedException({
      message: 'Неверный логин или пароль',
    });

    if (!user) throw error;

    const passwordsEqual = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!passwordsEqual) throw error;

    return user;
  }
}
