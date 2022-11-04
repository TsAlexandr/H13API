import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from '../infrastructure/user-query.repository';
import { UserRepository } from '../infrastructure/user.repository';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../../emailManager/email.service';

@Injectable()
export class UsersService {
  constructor(
    protected mailService: EmailService,
    protected userQueryRepo: UserQueryRepository,
    protected userRepo: UserRepository,
  ) {}
  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<any> {
    console.log('create user');
    const passwordSalt = await bcrypt.genSalt(12);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newUser = {
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
        isConfirmed: false,
      },
    };

    const createResult = await this.userRepo.createUser(newUser);
    try {
      await this.mailService.sendConfirmation(newUser);
    } catch (e) {
      console.log(e);
      return null;
    }
    return {
      id: createResult.id,
      login: createResult.login,
      email: createResult.email,
      createdAt: createResult.createdAt,
    };
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async checkCredentials(login: string, password: string): Promise<any> {
    const user = await this.userQueryRepo.findByLogin(login);
    console.log('User in creds with login ---> ' + login);
    if (!user) return null;
    const passwordHash = await this._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }
  async deleteUser(id: string) {
    return await this.userRepo.deleteUser(id);
  }

  async generatePasswordHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(12);
    const passwordHash = await this._generateHash(password, passwordSalt);

    return {
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
    };
  }

  async deleteAll() {
    return this.userRepo.deleteAll();
  }
}
