import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as FacebookProfile } from "passport-facebook";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import User from "../schemas/user.schema";

@Injectable()
export class ValidateService {
    constructor(
        @InjectModel('Users')
        private userModel: Model<User>) { }



    async validateUserOAuth(profile: GoogleProfile | FacebookProfile): Promise<any> {
        const { name, emails } = profile
        const userDB = await this.userModel.find({ email: emails[0].value })
        let _user: Object;
        if (userDB) {
            _user = {
                _id: userDB[0]._id,
                _email: userDB[0].email,
                _notes: userDB[0].notes,
                _tasks: userDB[0].tasks
            }
        } else {
            _user = {
                _email: emails[0].value,
                _first_name: name.givenName,
                _last_name: name.familyName
            }
        }
        return _user
    }

    async validate(payload) {
        const { id } = payload
        const user = await this.userModel.findById(id)
        if (!user) throw new UnauthorizedException('Por favor inicie sesión para continuar')
        const _user = {
            _id: user._id,
            _notes: user.notes,
            _tasks: user.tasks,
            _email: user.email
        }
        return _user
    }
}