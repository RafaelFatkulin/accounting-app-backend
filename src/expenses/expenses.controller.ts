import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './expenses.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/wallets/:walletId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Param('walletId') walletId: number,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return await this.expensesService.create(createExpenseDto, walletId);
  }

  @Get()
  async findAll(@Param('walletId') walletId: number): Promise<Expense[]> {
    return await this.expensesService.findAll(walletId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Expense> {
    return await this.expensesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return await this.expensesService.remove(id);
  }
}
