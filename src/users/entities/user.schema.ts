import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type UserDocument = User & Document
@Schema()
export class User{
  @Prop()
  login:string

  @Prop()
  email:string

  @Prop()
  createdAt:string

  @Prop()
  passwordHash:string

  @Prop()
  passwordSalt:string
  /*emailConfirmation:{type:emailConfirmationSchema, required:true},
  recoveryData:{type:recoverySchema}*/
}

export const UserSchema = SchemaFactory.createForClass(User)
