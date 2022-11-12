import { IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { Trim } from 'class-sanitizer';

export class CreatePostDto {
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 1000)
  content: string;

  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Length(1)
  blogId: string;
}
