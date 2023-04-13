import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { WalletsService } from '../wallets/wallets.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Expense } from './expenses.model';
import { Wallet } from '../wallets/wallets.model';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, WalletsService],
  imports: [
    SequelizeModule.forFeature([Expense, Wallet]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
})
export class ExpensesModule {}
