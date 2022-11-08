import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "../../blogs/entities/blogs.schema";
import { Model } from "mongoose";
import { Session, SessionDocument } from "../entities/session.schema";

export interface SessionDbType{
  ip:string
  title:string
  lastActiveDate:Date
  expiredDate:Date
  deviceId:string,
  userId:string
}

export class SessionRepository{
  constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) {}

  async createSession(session:SessionDbType){
    console.log(session)
    const createdSession = new this.sessionModel(session)
    createdSession.save();
    return {
      ip:createdSession.ip,
      title:createdSession.title,
      lastActiveDate:createdSession.lastActiveDate,
      deviceId:createdSession.deviceId
    }
  }
  async getSessionByDeviceId(deviceId:string){
    const session = await this.sessionModel.findOne({deviceId:deviceId},{projection:{_id:0}});
    return session;
  }
  async getSessionByUserByDeviceAndByDate(userId:string, deviceId:string, issuedAt:Date){
    const sessions = await this.sessionModel.find({userId:userId, deviceId:deviceId, lastActiveDate:issuedAt}).lean();
    return sessions;
  }

  async updateSession(userId:string,deviceId:string,expiredDate:Date,issuedAt:Date){
    const result = await this.sessionModel.updateOne({userId:userId, deviceId:deviceId}, {$set:{expiredDate:expiredDate, lastActiveDate:issuedAt}})
    return result.matchedCount === 1
  }
  async getSessionsByUserId(userId:string){
    const sessions = await this.sessionModel.find({userId: userId}).lean()
    return sessions
  }
  async removeSessionByDeviceId(userId:string,deviceId:string){
    const result = await this.sessionModel.deleteOne({userId:userId,deviceId:deviceId})
    return result.deletedCount === 1
  }

  async removeAllSessionsByUserId(userId:string,deviceId:string){
    const result = await this.sessionModel.deleteMany({userId:userId, deviceId:{$ne:deviceId}})
    return result.deletedCount > 0
  }

  async deleteAll():Promise<boolean>{
    const result = await this.sessionModel.deleteMany({})
    return result.deletedCount > 1
  }
}