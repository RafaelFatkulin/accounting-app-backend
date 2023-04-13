import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Необходимо указать логин и пароль');
    }

    return await this.userRepository.create(createUserDto);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new NotFoundException(`Пользователь не найден`);
    return user;
  }

  async getUserByLogin(login: string) {
    return await this.userRepository.findOne({ where: { login } });
  }
}
