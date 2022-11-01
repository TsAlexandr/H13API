import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService{
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string, name: string) {
    console.log(email)
    await this.mailerService.sendMail({
      to: email,
      subject: 'Greeting from NestJS NodeMailer',
      template: './email',
      context: {
        name: name
      }
    })
  }

  async sendConfirmation(user:any){
    console.log("user  "+user.email)
    console.log(this.mailerService)
    const result = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Greeting from NestJS NodeMailer',
      template: './email',
      context: {
        name: "Devliss"
      }
    }).then((success) => {
      console.log(success)
    })
      .catch((err) => {
        console.log(err)
      });
    console.log(result)
    console.log("result")
    return false
  }
}