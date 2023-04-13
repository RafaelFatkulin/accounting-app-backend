import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Wallet } from './wallets.model';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(@InjectModel(Wallet) private walletRepository: typeof Wallet) {}

  async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
    if (!createWalletDto.name || !createWalletDto.userId)
      throw new BadRequestException(
        'Необходимо указать название кошелька и ID пользователя',
      );

    return await this.walletRepository.create(createWalletDto);
  }

  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    if (!updateWalletDto.name)
      throw new BadRequestException(
        'Необходимо указать новое название кошелька',
      );
    const [, wallet] = await this.walletRepository.update(updateWalletDto, {
      where: { id },
      returning: true,
    });
    return wallet[0];
  }

  async findAll(userId): Promise<Wallet[]> {
    if (!userId)
      throw new BadRequestException('Необходимо ввести ID пользователя');

    const wallets = await this.walletRepository.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!wallets.length)
      throw new NotFoundException('У пользователя нет кошельков');
    return wallets;
  }

  async findOne(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findByPk(id);
    if (!wallet)
      throw new HttpException('Кошелек не найден', HttpStatus.NOT_FOUND);
    return wallet;
  }

  async remove(id: number): Promise<{ message: string }> {
    const walletToDelete = await this.findOne(id);
    if (!walletToDelete) throw new NotFoundException('Кошелек не найден');
    if (walletToDelete) await this.walletRepository.destroy({ where: { id } });
    return { message: 'Кошелек удален' };
  }
}
