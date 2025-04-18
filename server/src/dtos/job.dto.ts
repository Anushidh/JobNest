import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

// Salary Sub-DTO
class SalaryDto {
  @IsString()
  @IsOptional()
  min!: string;
  
  @IsString()
  @IsOptional()
  max!: string;
}

// Main Create Job DTO
export class CreateJobDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  title!: string;

  @IsString()
  @MinLength(50)
  @IsNotEmpty()
  description!: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  companyName!: string;

  @ValidateNested()
  @Type(() => SalaryDto)
  salary!: SalaryDto;

  @IsEnum(["full-time", "part-time", "contract", "internship"])
  jobType!: "full-time" | "part-time" | "contract" | "internship";

  @IsEnum(["remote", "hybrid", "onsite"])
  location!: "remote" | "hybrid" | "onsite";

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsNotEmpty({ each: true })
  skillsRequired!: string[];

  @IsEnum(["entry", "mid", "senior", "lead"])
  experienceLevel!: "entry" | "mid" | "senior" | "lead";

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  educationRequirements?: string[];

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  deadline?: Date;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false;
}

// Update Job DTO (all fields optional)
export class UpdateJobDto extends CreateJobDto {
  @IsOptional()
  declare title: string;

  @IsOptional()
  declare description: string;

  // ... make all other fields optional
}
