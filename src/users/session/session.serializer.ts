import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class Session extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): void {    
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void): void {
    done(null, payload);
  }
}
