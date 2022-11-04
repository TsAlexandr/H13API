import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByLoginOrEmail(loginOrEmail: string): Promise<any> {
    const user = await this.userModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  }
  async findByLogin(login: string) {
    const user = await this.userModel.findOne(
      {
        login: login,
      } /*{$or:[{"email":loginOrEmail},{"userName":loginOrEmail}]}*/,
    );
    return user;
  }
  async findById(id: string) {
    const user = await this.userModel.findById(id);
    console.log('Repo');
    console.log(user);
    return user;
  }

  async getUsers(
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: any,
  ) {
    const users = await this.userModel
      .find(
        {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        },
        { passwordHash: 0, passwordSalt: 0 },
      )
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const temp = users.map((user) => {
      return user.toJSON();
    });

    const totalCount = await this.userModel.count({
      $or: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });

    const outputObj = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: temp,
    };
    return outputObj;
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }
  async getUserByRecoveryCode(code: string): Promise<any> {
    const user = await this.userModel.findOne({
      'recoveryData.recoveryCode': code,
    });
    return user;
  }
}
