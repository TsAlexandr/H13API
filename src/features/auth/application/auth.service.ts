import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/infrastructure/user.repository';
import { UserQueryRepository } from '../../users/infrastructure/user-query.repository';
import { UsersService } from '../../users/application/users.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { EmailService } from '../../../emailManager/email.service';
import { NewPasswordDto } from '../dto/newPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private userQueryRepo: UserQueryRepository,
    protected mailService: EmailService,
    private userService: UsersService,
    private userRepo: UserRepository,
  ) {}
  async confirmEmail(code: string) {
    const user = await this.userQueryRepo.getUserByCode(code);
    console.log(user);
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.isConfirmed) {
      return false;
    }
    console.log(user.id);
    const result = await this.userRepo.updateConfirmation(user.id);
    return true;
  }
  async sendRecoveryCode(email: string) {
    const user = await this.userQueryRepo.getByEmail(email);
    console.log(email);
    console.log(user);
    console.log('Recovery Code');
    if (!user) {
      console.log('User not found');
      return null;
    }

    const recoveryCode = uuidv4();
    const recoveryData = {
      recoveryCode: recoveryCode,
      expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
      isConfirmed: false,
    };
    console.log(recoveryCode);
    const updatedUser = await this.userRepo.createRecoveryData(
      user.id,
      recoveryData,
    );
    const result = await this.mailService.sendRecoveryCode(updatedUser);
    return result;
  }
  async confirmPassword(npDto: NewPasswordDto) {
    const user = await this.userQueryRepo.getUserByRecoveryCode(
      npDto.recoveryCode,
    );
    if (!user) {
      return false;
    }
    if (user.recoveryData.isConfirmed) {
      return false;
    }

    const passwordData = await this.userService.generatePasswordHash(
      npDto.newPassword,
    );
    console.log('confirm password');
    console.log(user);
    console.log(passwordData);
    await this.userRepo.confirmPassword(user.id, passwordData);
    return true;
  }
  async resendConfirmCode(email: string) {
    let user = await this.userQueryRepo.getByEmail(email);
    console.log('RESEND ');
    if (!user) {
      return null;
    }
    const confirmCode = uuidv4();
    const updateRes = await this.userRepo.updateConfirmationCode(
      user.id,
      confirmCode,
    );
    user = await this.userQueryRepo.getByEmail(email);
    const result = await this.mailService.sendConfirmation(user);
    return result;
  }
}
