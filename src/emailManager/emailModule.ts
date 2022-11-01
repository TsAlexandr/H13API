import { Module } from '@nestjs/common';
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports:[MailerModule.forRoot({
    transport:{
    //  service:"gmail",
    host:"smtp.gmail.com",//process.env.SMTP_HOST,
    port:465,//process.env.SMTP_PORT,*/
    secure:true,
    auth:{
      user:"devliss158@gmail.com",//"devliss@yandex.ru",//process.env.SMTP_USER,
      pass:""//"9c4j3W54dh7JKUu"//process.env.SMTP_PASSWORD
    }
  },
    defaults:{
      from:'"Devliss" <devliss158@gmail.com>'
    },
    template: {
      dir: __dirname + '/templates',
      adapter: new HandlebarsAdapter(),
      /*options: {
        strict: true,
      },*/
    },
  })],
  controllers:[],
  providers: [EmailService],
  exports:[EmailService]
})
export class EmailModule {}
