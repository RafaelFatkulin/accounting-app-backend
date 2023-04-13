import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { WalletsModule } from './wallets/wallets.module';
import { Wallet } from './wallets/wallets.model';
import { IncomesModule } from './incomes/incomes.module';
import { Income } from './incomes/incomes.model';
import { ExpensesModule } from './expenses/expenses.module';
import { Expense } from './expenses/expenses.model';
import { AuthModule } from './auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [User, Wallet, Income, Expense],
      autoLoadModels: true,
    }),
    UsersModule,
    WalletsModule,
    IncomesModule,
    ExpensesModule,
    AuthModule,
  ],
})
export class AppModule {}
