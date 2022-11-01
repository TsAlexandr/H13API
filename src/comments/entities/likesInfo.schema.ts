import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({_id:false, versionKey:false})
export class LikesInfo{
  @Prop()
  likesCount:  number

  @Prop()
  dislikesCount: number

  @Prop()
  myStatus: string
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo)