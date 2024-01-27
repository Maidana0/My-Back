import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20"
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import User from "../schemas/user.schema";
import { ValidateService } from "./validateService";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        // @InjectModel('Users')
        // private userModel: Model<User>
        private readonly validateService: ValidateService
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email']
        })
    }

    async validate(
        accessToken: string, refreshToken: string,
        profile: Profile, done: VerifyCallback): Promise<any> {
        const user = await this.validateService.validateUserOAuth(profile)
        done(null, user)
    }


    // async validate(
    //     accessToken: string,
    //     refreshToken: string,
    //     profile: Profile,
    //     done: VerifyCallback
    // ): Promise<any> {
    //     const { emails, name } = profile
    //     const userDB = await this.userModel.find({ email: emails[0].value })
    //     let _user: Object;
    //     if (userDB[0]) {
    //         _user = {
    //             _id: userDB[0]._id,
    //             _email: userDB[0].email,
    //             _notes: userDB[0].notes,
    //             _tasks: userDB[0].tasks
    //         }
    //     } else {
    //         _user = {
    //             _email: emails[0].value,
    //             _first_name: name.givenName,
    //             _last_name: name.familyName,
    //         }
    //     }

    //     done(null, _user)
    // }
}