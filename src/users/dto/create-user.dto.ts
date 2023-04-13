import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 72, {
    message: 'Логин должен быть не меньше 8 символов и не больше 72',
  })
  readonly login: string;

  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 72, {
    message: 'Пароль должен быть не меньше 4 символов и не больше 72',
  })
  readonly password: string;
}
