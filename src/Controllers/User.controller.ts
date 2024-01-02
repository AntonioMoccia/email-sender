import { database } from "src/DataSources";
import User from "src/Entities/User";
import { TUser } from "src/types/User";
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import AuthService from "@Services/Auth.service";

class UserController {
    static createUser(req: Request, res: Response) {

        const create_user = database.getRepository(User)
        
        const encryptedPass = AuthService.encryptPass('stringa')
        console.log(encryptedPass);
        
    /*     create_user.create({
            ...user
        }) */
    }



}

export default UserController