import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from './expenses.model';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense) private expenseRepository: typeof Expense,
    private readonly walletsService: WalletsService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    walletId: number,
  ): Promise<Expense> {
    const wallet = await this.walletsService.findOne(walletId);
    if (!wallet) throw new NotFoundException('Кошелек не найден');

    if (!createExpenseDto.name || !createExpenseDto.amount)
      throw new BadRequestException('Необходимы название расхода и сумма');

    const expense = await this.expenseRepository.create({
      ...createExpenseDto,
      walletId,
    });

    wallet.balance -= expense.amount;
    await wallet.save();

    return expense;
  }

  async findAll(walletId: number): Promise<Expense[]> {
    const wallet = await this.walletsService.findOne(walletId);
    const expenses = await this.expenseRepository.findAll({
      where: { walletId },
    });

    if (!wallet) throw new NotFoundException('Кошелек не найден');
    if (!expenses || expenses.length == 0)
      throw new NotFoundException('У кошелька нет расходов');

    return expenses;
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findByPk(id);
    if (!expense) throw new NotFoundException('Расход не найден');
    return expense;
  }

  async remove(id: number): Promise<{ message: string }> {
    const expenseToDelete = await this.findOne(id);

    if (!expenseToDelete) throw new NotFoundException('Расход не найден');

    const wallet = await this.walletsService.findOne(expenseToDelete.walletId);
    wallet.balance += expenseToDelete.amount;
    await wallet.save();

    await this.expenseRepository.destroy({ where: { id } });

    return { message: 'Расход удален' };
  }
}
