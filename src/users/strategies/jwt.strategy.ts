import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ValidateService } from "./validateService";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly validateService: ValidateService

    ) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            // si existe una session con token retornara ese valor
            if (req && req.session.token) {
                token = req.session.token
            } else if ((req && req.cookies.token)) {
                token = req.cookies['token'];
            }
            // sino retornara el valor del token guardado en la cookie "token"
            // O el otorgado en el Header Auth como Bearer ...Token
            return ExtractJwt.fromAuthHeaderAsBearerToken()(req) || token
        };


        super({
            ignoreExpiration: false,
            jwtFromRequest: extractJwtFromCookie,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {
        const _user = await this.validateService.validate(payload)
        return _user
    }
}