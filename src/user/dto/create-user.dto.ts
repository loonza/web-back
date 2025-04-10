import { user_role_enum } from '@prisma/client';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  role: user_role_enum;
}
