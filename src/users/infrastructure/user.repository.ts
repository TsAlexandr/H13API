import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Schema } from "mongoose";
import { User, UserDocument } from "../entities/user.schema";

export class UserRepository{
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>) {
  }

  async createUser(user:any){
    const createdUser = new this.userModel(user)
    await createdUser.save()
    return createdUser;
  }

  async deleteUser(id:string){
    const result = await this.userModel.deleteOne({_id:new mongoose.SchemaTypes.ObjectId(id)})
    return result.deletedCount === 1
  }

  async deleteAll():Promise<boolean>{
    const result = await this.userModel.deleteMany({})
    return result.deletedCount === 1
  }

  async updateConfirmation(id:string){
    const result = await this.userModel.updateOne({_id:new mongoose.SchemaTypes.ObjectId(id)}, {$set:{"emailConfirmation.isConfirmed":true}})
    return result.modifiedCount === 1
  }

  async updateConfirmationCode(id:string, code:string){
    const result = await this.userModel.updateOne({_id:new mongoose.SchemaTypes.ObjectId(id)}, {$set:{"emailConfirmation.confirmationCode":code}})
    return result.modifiedCount === 1
  }

  async createRecoveryData(userId:any, recovery:{recoveryCode:string,expirationDate:Date,isConfirmed:boolean}){
    const user =  await this.userModel.updateOne({_id:userId},{$set:{recoveryData:recovery}})
    const updatedUser = await this.userModel.findOne({_id:userId})
    console.log(updatedUser)
    return updatedUser
  }
  async confirmPassword(userId:string, passwordData:{passwordSalt:string,passwordHash:string}){
    const user =  await this.userModel.findOneAndUpdate(
      {_id:new mongoose.SchemaTypes.ObjectId(userId)},
      {$set:{
          "recoveryData.isConfirmed":true,
          passwordHash:passwordData.passwordHash,
          passwordSalt:passwordData.passwordSalt
        }})
    return user
  }
}