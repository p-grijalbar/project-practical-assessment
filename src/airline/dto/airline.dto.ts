import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AirlineDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  readonly foundationDate: Date;

  @IsNotEmpty()
  @IsUrl()
  readonly website: string;
}
