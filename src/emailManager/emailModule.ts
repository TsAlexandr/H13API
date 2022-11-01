import { Module } from '@nestjs/common';
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports:[MailerModule.forRoot({
    transport:{
    //  service:"gmail",
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:true,
    auth:{
      user:process.env.SMTP_USER,
      pass:process.env.SMTP_PASSWORD
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
