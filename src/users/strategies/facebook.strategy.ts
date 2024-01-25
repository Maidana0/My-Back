import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook"

@Injectable()
export class FaceboookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            scope: 'email',
            profileFields: ['email', 'name']
        })
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void
    ): Promise<any> {
        const { name, emails } = profile
        const user = {
            email: emails[0].value,
            first_name: name.givenName,
            last_name: name.familyName
        }
        done(null, user)
    }
}