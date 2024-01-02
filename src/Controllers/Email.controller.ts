import EmailService from "@Services/Email.service"
import { Request, Response } from "express"



class EmailController {
    constructor() { }

    static async sandEmail(req: Request, res: Response) : Promise<void> {
        new EmailService().sandEmail(req.body)
    }
}
export default EmailController


