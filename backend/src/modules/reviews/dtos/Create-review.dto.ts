import { IsInt, IsOptional, IsString, Max, Min, MaxLength } from "class-validator";

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000) 
  comment?: string;

  @IsOptional()
  @IsInt()
  @Min(1)   
  @Max(5)   // y como máximo 5
  rating?: number;
}