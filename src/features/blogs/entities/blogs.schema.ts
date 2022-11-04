import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type BlogDocument = Blog & Document;

@Schema({ versionKey: false })
export class Blog {
  @Prop()
  name: string;

  @Prop()
  youtubeUrl: string;

  @Prop()
  createdAt: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
