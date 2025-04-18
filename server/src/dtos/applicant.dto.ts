import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

export class CreateApplicantDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  @IsOptional() // Optional to support Google Auth
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  @IsOptional() // Optional to support Google Auth
  password?: string;
}

export class UpdateApplicantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsNotEmpty({ each: true })
  skills?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  education?: string[];
}
