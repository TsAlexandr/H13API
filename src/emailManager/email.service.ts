import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService{
  constructor(private readonly mailerService: MailerService) {}


  async sendConfirmation(user:any){
    console.log("user  "+user.email)
    console.log(this.mailerService)
    const result = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Регистрация',
      template: './email-confirmation',
      context: {
        code: user.emailConfirmation.confirmationCode
      }
    })

    return result
  }

  async sendRecoveryCode(user:any){
    console.log("user  "+user.email)
    console.log(this.mailerService)
    const result = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Восстановление пароля',
      template: './email-confirmation',
      context: {
        code: user.recoveryData.recoveryCode
      }
    })

    return result
  }
}