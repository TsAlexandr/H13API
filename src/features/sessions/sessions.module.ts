import { Module } from '@nestjs/common';
import { SessionsController } from './api/sessions.controller';
import { SessionsService } from './application/sessions.service';
import { JwtService } from './application/jwt.service';
import { SessionRepository } from './infrastructure/session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, JwtService, SessionRepository],
  exports: [SessionsService, JwtService],
})
export class SessionsModule {}
