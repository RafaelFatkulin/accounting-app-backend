import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wallet } from './wallets.model';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  imports: [
    SequelizeModule.forFeature([Wallet]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [WalletsService],
})
export class WalletsModule {}
