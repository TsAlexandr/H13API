import { Module } from '@nestjs/common';
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from 'path';

@Module({
  imports:[MailerModule.forRoot({
    transport:{
    host:"smtp.yandex.ru",//process.env.SMTP_HOST,
    port:465,//process.env.SMTP_PORT,
    secure:true,
    auth:{
      user:"devliss@yandex.ru",//process.env.SMTP_USER,
      pass:"9c4j3W54dh7JKUu"//process.env.SMTP_PASSWORD
    }
  },
    defaults:{
      from:'"Devliss" <devliss@yandex.ru>'
    },
    template: {
      dir: __dirname + '\\templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  })],
  controllers:[],
  providers: [EmailService],
  exports:[EmailService]
})
export class EmailModule {}
