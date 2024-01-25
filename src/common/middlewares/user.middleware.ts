import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from "express";

// @Injectable()
// export class UserMiddleware implements NestMiddleware {
//   use(req: any, res: any, next: () => void) {
//     next();
//   }
// }


@Injectable()
export class NewMiddleware implements NestMiddleware {

   async use(req: Request, res: Response, next: NextFunction,) {
        console.log("MIDDLEWARE USER...")
        next()
    }



}