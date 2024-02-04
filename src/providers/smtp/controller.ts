import { Request, Response, NextFunction, Router } from 'express'
import SMTP from "@providers/smtp/service"



class SMTPController {

    gmailService: SMTP

    static base(req: Request, res: Response, next: NextFunction) {
        res.send('Hello from SMTP Provider')
    }
    static async sendEmail(req: Request, res: Response, next: NextFunction) {

    }
    //ritorna l'url da aprire per fare il login
    static async login(req: Request, res: Response, next: NextFunction) {
        const smtp = new SMTP()
        const { host, port, user, password } = req.body
        const login = smtp.login(host, port, user, password)
        res.json(login)
    }
    //ritorna l'url da aprire per fare il login
    static update(req: Request, res: Response, next: NextFunction) {
        const smtp = new SMTP()
    }
    static async delete(req: Request, res: Response, next: NextFunction) {

    }
    static async redirect(req: Request, res: Response, next: NextFunction) {

    }
}

export default SMTPController