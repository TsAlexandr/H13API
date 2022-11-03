import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import {transformSortDirection} from "../../common/helpers/cast.helper";

export class BlogQueryDto{
  @IsString()
  @IsOptional()
  public searchNameTerm:string = ""

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  public pageNumber:number = 1

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  public pageSize:number = 10


  @IsString()
  @IsOptional()
  public sortBy:string = "createdAt"

  @Transform(({value}) => transformSortDirection(value))
  @IsOptional()
  @IsString()
  public sortDirection:string = "desc"
}