import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import User from "src/Entities/User"
import {Request} from 'express'
import dns from 'dns'
interface IAuthenticationBase {
    login: () => void
    logout: () => void
    logOn: () => void
    compareToken: (token: string, database_token: string) => boolean
    cryptPass: () => void
    extractTokenFromHeader : ()=>void
}

class AuthService implements IAuthenticationBase {
    constructor(req:Request) { }
    
    login(): string {
        return 'hello'
    }
    logout(): void { }
    
    logOn: () => void

    compareToken: (token: string, database_token: string) => boolean

    cryptPass: () => void

    extractTokenFromHeader:()=>void
    
    checkDomainExist(req:Request){
        const hosts : any = []
        dns.lookupService(req.ip, 5000, (error, host, service) => {
            if (error) {
                console.log('non sei autorizzato');
                return;
            }
            if (!hosts.includes(host)) {
                console.log('non sei nella lista');
                return
            }
            return console.log('sei nella lista')
        })
    }

    static encryptPass(password:string) {
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        return hash
    }
}

export default AuthService