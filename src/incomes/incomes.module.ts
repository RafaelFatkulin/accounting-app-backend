import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Income } from './incomes.model';
import { Wallet } from '../wallets/wallets.model';
import { WalletsService } from '../wallets/wallets.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, WalletsService],
  imports: [
    SequelizeModule.forFeature([Income, Wallet]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
})
export class IncomesModule {}
