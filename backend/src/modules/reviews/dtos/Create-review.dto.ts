import { IsInt, IsOptional, IsString, Max, Min, MaxLength } from "class-validator";

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000) // Por ejemplo, limita el comentario a 5000 caracteres
  comment?: string;

  @IsOptional()
  @IsInt()
  @Min(1)   // La calificación debe ser como mínimo 1
  @Max(5)   // y como máximo 5
  rating?: number;
}