import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeDocument = Like & Document;
@Schema()
export class Like {
  @Prop()
  commentId: string;

  @Prop()
  postId: string;

  @Prop()
  addedAt: string;

  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  status: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
