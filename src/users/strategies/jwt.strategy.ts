import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import User from '../schemas/user.schema';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    // constructor(@InjectModel("Tasks") private tasksModel) { }

    constructor(
        @InjectModel('Users')
        private userModel: Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {
        const { id } = payload
        const user = await this.userModel.findById(id)
        if (!user) {
            throw new UnauthorizedException('Debe iniciar sesión para continuar')
        }
        return(user)
    }
}