import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UserQueryDto{

  @IsOptional()
  public searchLoginTerm:string = ""

  @IsOptional()
  public searchEmailTerm:string = ""

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  public pageNumber:number = 1

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  public pageSize:number = 10

  @IsOptional()
  public sortBy:string = "createdAt"

  @IsOptional()
  public sortDirection:string = "desc"
}