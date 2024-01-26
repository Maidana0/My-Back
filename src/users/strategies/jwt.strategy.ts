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
            // si existe una session con token retornara ese valor
            if (req && req.session.token) {
                token = req.session.token
            } else if ((req && req.cookies)) {
                token = req.cookies['token'];
            }
            // sino retornara el valor del token guardado en la cookie "token"
            // O el otorgado en el Header Auth como Bearer ...Token
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