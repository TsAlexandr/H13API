import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ELISchema, ExtendedLikesInfo } from './extendedLikesInfo.schema';
export type PostDocument = Post & Document;
@Schema({ versionKey: false })
export class Post {
  @Prop()
  title: string;
  @Prop()
  content: string;
  @Prop()
  shortDescription: string;
  @Prop()
  blogName: string;
  @Prop()
  blogId: string;
  @Prop()
  createdAt: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
