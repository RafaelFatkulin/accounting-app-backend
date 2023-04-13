import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Wallet } from '../wallets/wallets.model';

interface UserCreationAttrs {
  login: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: { min: 8, max: 255 },
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { min: 8, max: 72 },
  })
  password: string;

  @HasMany(() => Wallet)
  wallets: Wallet[];
}
