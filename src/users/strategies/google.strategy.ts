import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20"
import { Injectable } from "@nestjs/common";
import { ValidateService } from "./validateService";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly validateService: ValidateService
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        })
    }

    async validate(
        accessToken: string, refreshToken: string,
        profile: Profile, done: VerifyCallback): Promise<any> {
        const user = await this.validateService.validateUserOAuth(profile)
        done(null, user)
    }

}