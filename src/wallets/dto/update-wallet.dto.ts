import { IsString, Length } from 'class-validator';

export class UpdateWalletDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 255, {
    message: 'Название должно быть не меньше 1 символа и не больше 255',
  })
  readonly name: string;
}
