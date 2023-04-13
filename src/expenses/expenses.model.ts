import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Wallet } from '../wallets/wallets.model';

interface ExpenseCreationAttrs {
  name: string;
  amount: number;
  walletId: number;
}

@Table({ tableName: 'expense' })
export class Expense extends Model<Expense, ExpenseCreationAttrs> {
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
    validate: { max: 255 },
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;

  @ForeignKey(() => Wallet)
  @Column({ type: DataType.INTEGER, field: 'walletId' })
  walletId: number;

  @BelongsTo(() => Wallet)
  wallet: Wallet;
}
