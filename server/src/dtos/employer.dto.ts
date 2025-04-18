import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class CreateEmployerDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  @IsOptional() // Optional because of Google Auth
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  companyName!: string;
}

export class UpdateEmployerDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  headquarters?: string;

  @IsString()
  @IsOptional()
  companySize?: string;

  @IsString()
  @IsOptional()
  foundedYear?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  companyTagline?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  missionStatement?: string;

  @IsString()
  @IsOptional()
  companyCulture?: string;
}
