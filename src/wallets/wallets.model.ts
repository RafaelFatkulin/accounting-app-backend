import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Income } from '../incomes/incomes.model';
import { Expense } from '../expenses/expenses.model';

interface WalletCreationAttrs {
  name: string;
}

@Table({ tableName: 'wallet' })
export class Wallet extends Model<Wallet, WalletCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  balance: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, field: 'userId' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Income)
  incomes: Income[];

  @HasMany(() => Expense)
  expenses: Income[];
}
