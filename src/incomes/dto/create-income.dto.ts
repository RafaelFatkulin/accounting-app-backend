import { IsNumber, IsString, Length } from 'class-validator';

export class CreateIncomeDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 255, {
    message: 'Название должно быть не меньше 8 символов и не больше 72',
  })
  readonly name: string;

  @IsNumber({}, { message: 'Должно быть числом' })
  readonly amount: number;
}
