import GmailService from "@Services/EmailServices/gmail/Gmail.service"
import { Request, Response } from "express"



class EmailController {
    constructor() { }

    static async sandEmail(req: Request, res: Response): Promise<void> {
 
        const initService = new GmailService({ id_service: req.params.service })
        const serviceInfo = await initService.getServiceInfo()
        const userInfo = await initService.getUserInfo(String(serviceInfo?.authParams.access_token))
        await initService.authenticate({
            access_token:String(serviceInfo?.authParams.access_token),
            refresh_token:String(serviceInfo?.authParams.refresh_token)
        })
        const sand = await initService.sandEmail()
        console.log(sand);

        res.json(sand)
    }
    static async login(req: Request, res: Response): Promise<void> {
        const initService = new GmailService()
        const authUrl = initService.generateAuthUrl()
        req.internalParams = {
            int: "value"
        }
        res.json({ url: authUrl })
    }
    static async saveLogin(req: Request, res: Response): Promise<void> {
       
        const gmailService = new GmailService()

        try {
            const resTokens = await gmailService.getTokens(String(req.query.code))

            gmailService.createService({
                authParams: {
                    access_token: String(resTokens.tokens.access_token),
                    refresh_token: String(resTokens.tokens.refresh_token)
                }
            })

            res.status(200).json({ tokens: resTokens })
        } catch (error) {
            res.status(401).json({ message: "non autorizzato" })
        }
    }
}
export default EmailController


