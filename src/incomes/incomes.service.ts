import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Income } from './incomes.model';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(Income) private incomeRepository: typeof Income,
    private readonly walletsService: WalletsService,
  ) {}

  async create(
    createIncomeDto: CreateIncomeDto,
    walletId: number,
  ): Promise<Income> {
    const wallet = await this.walletsService.findOne(walletId);
    if (!wallet) throw new NotFoundException('Кошелек не найден');

    if (!createIncomeDto.name || !createIncomeDto.amount)
      throw new BadRequestException('Необходимы название дохода и сумма');

    const income = await this.incomeRepository.create({
      ...createIncomeDto,
      walletId,
    });

    wallet.balance += income.amount;
    await wallet.save();

    return income;
  }

  async findAll(walletId: number): Promise<Income[]> {
    const wallet = await this.walletsService.findOne(walletId);
    const incomes = await this.incomeRepository.findAll({
      where: { walletId },
    });

    if (!wallet) throw new NotFoundException('Кошелек не найден');
    if (!incomes || incomes.length == 0)
      throw new NotFoundException('У кошелька нет доходов');

    return incomes;
  }

  async findOne(id: number): Promise<Income> {
    const income = await this.incomeRepository.findByPk(id);
    if (!income) throw new NotFoundException('Доход не найден');
    return income;
  }

  async remove(id: number): Promise<{ message: string }> {
    const incomeToDelete = await this.findOne(id);

    if (!incomeToDelete) throw new NotFoundException('Доход не найден');

    const wallet = await this.walletsService.findOne(incomeToDelete.walletId);
    wallet.balance -= incomeToDelete.amount;
    await wallet.save();

    await this.incomeRepository.destroy({ where: { id } });

    return { message: 'Доход удален' };
  }
}
