import { IsUrl, Length } from "class-validator";

export class CreateBlogDto{
  @Length(1, 15)
  public name: string

  @Length(1, 100)
  @IsUrl()
  public youtubeUrl: string
}