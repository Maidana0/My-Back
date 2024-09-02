import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook"
import { ValidateService } from "./validateService";

@Injectable()
export class FaceboookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private readonly validateService: ValidateService
    ) {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: (
                (process.env.MODE === 'prod' ? process.env.PROD_API_URL : process.env.DEV_API_URL)
                + "/api/" + process.env.FACEBOOK_CALLBACK_URL
            ),
            scope: 'email',
            profileFields: ['email', 'name']
        })
    }

    async validate(
        accessToken: string, refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void
    ): Promise<any> {
        const user = await this.validateService.validateUserOAuth(profile)
        done(null, user)
    }


    // async validate(
    //     accessToken: string,
    //     refreshToken: string,
    //     profile: Profile,
    //     done: (error: any, user?: any, info?: any) => void
    // ): Promise<any> {
    //     const { name, emails } = profile
    //     const userDB = await this.userModel.find({ email: emails[0].value })
    //     let _user: Object;
    //     if (userDB) {
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
    //             _last_name: name.familyName
    //         }
    //     }

    //     done(null, _user)
    // }
}