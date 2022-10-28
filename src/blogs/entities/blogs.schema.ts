/*
* import mongoose from "mongoose";

const blogsScheme = new mongoose.Schema({
    name:String,
    youtubeUrl:String,
    createdAd:String
},{
    versionKey: false // You should be aware of the outcome after set to false
})
export const BlogsModel = mongoose.model('blogs', blogsScheme)
* */


import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
    @Prop()
    name: string;

    @Prop()
    youtubeUrl: string;

    @Prop()
    createdAt: string;
}

export const BlogsSchema = SchemaFactory.createForClass(Blog);