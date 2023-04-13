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
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { Income } from './incomes.model';
import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/wallets/:walletId/incomes')
@UseGuards(JwtAuthGuard)
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Param('walletId') walletId: number,
    @Body() createIncomeDto: CreateIncomeDto,
  ): Promise<Income> {
    return await this.incomesService.create(createIncomeDto, walletId);
  }

  @Get()
  async findAll(@Param('walletId') walletId: number): Promise<Income[]> {
    return await this.incomesService.findAll(walletId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.incomesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return await this.incomesService.remove(id);
  }
}
