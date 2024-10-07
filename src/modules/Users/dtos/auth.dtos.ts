import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
