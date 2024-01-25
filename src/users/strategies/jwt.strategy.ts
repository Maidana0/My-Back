import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import User from '../schemas/user.schema';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectModel('Users')
        private userModel: Model<User>
    ) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['token'];
            }
            return ExtractJwt.fromAuthHeaderAsBearerToken()(req) || token
        };


        super({
            ignoreExpiration: false,
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: extractJwtFromCookie,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {
        const { id } = payload
        const user = await this.userModel.findById(id)
        if (!user) throw new UnauthorizedException('Por favor inicie sesión para continuar')

        return user
    }
}