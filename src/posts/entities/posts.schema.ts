/*
* import mongoose from "mongoose";

const extendedLikesInfo = new mongoose.Schema({
    "likesCount": Number,
    "dislikesCount": Number,
    "myStatus": String,
    "newestLikes": [
        {
            "addedAt": String,
            "userId": String,
            "login": String
        }
    ]
},{_id:false, versionKey:false})
const postsSchema = new mongoose.Schema({
    title:String,
    shortDescription:String,
    content:String,
    blogName:String,
    blogId:String,
    createdAt:String,
    extendedLikesInfo:{type:extendedLikesInfo}
},{
    versionKey: false
})
export const PostsModel = mongoose.model('posts', postsSchema)
* */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Blog } from "../../blogs/entities/blogs.schema";
import { ELISchema, ExtendedLikesInfo } from "./extendedLikesInfo.schema";
export type PostDocument = Post & Document;
@Schema({versionKey:false})
export class Post{
  @Prop()
  title:string
  @Prop()
  shortDescription:string
  @Prop()
  content:string
  @Prop()
  blogName:string
  @Prop()
  blogId:string
  @Prop()
  createdAt:string
  @Prop({type:ELISchema})
  extendedLikesInfo:ExtendedLikesInfo
}
export const PostSchema = SchemaFactory.createForClass(Post);
