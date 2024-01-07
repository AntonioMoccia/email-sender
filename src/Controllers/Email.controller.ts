import GmailService from "@Services/EmailServices/gmail/Gmail.service"
import { Request, Response } from "express"



class EmailController {
    constructor() { }

    static async sandEmail(req: Request, res: Response): Promise<void> {

        const initService = new GmailService({ id_service: req.params.service })

        const serviceInfo = await initService.getServiceInfo()

        /**Authentication will move to sandEmail method */
        if ((serviceInfo instanceof Error)) {
            res.status(500).json({
                message: serviceInfo.message
            })
            return
        }
        await initService.authenticate({
            access_token: String(serviceInfo?.authParams.access_token),
            refresh_token: String(serviceInfo?.authParams.refresh_token)
        })
        /**Here are user info like email address */
        const userInfo = await initService.getUserInfo(String(serviceInfo?.authParams.access_token))
        const tokenInfo = await initService.getToken(String(serviceInfo?.authParams.access_token))


        const sand = await initService.sandEmail()
        console.log('provider', initService.provider);

        res.json(sand)
    }
    static async login(req: Request, res: Response): Promise<void> {
        const service = new GmailService()
        const authUrl = service.generateAuthUrl(req.params.id_service)
       
        res.json({ url: authUrl })

    }
    static async redirect(req: Request, res: Response): Promise<void> {
        const service_id = req.query.state ? JSON.parse(String(req.query.state)).service_id : undefined
        const gmailService = new GmailService()

        try {
            const resTokens = await gmailService.getTokensByCode(String(req.query.code))
            const userInfo = await gmailService.getUserInfo(String(resTokens.tokens.access_token))
            if (service_id) {

                gmailService.updateService(service_id, {
                    authParams: {
                        access_token: String(resTokens.tokens.access_token),
                        refresh_token: String(resTokens.tokens.refresh_token)
                    }
                })
            } else {

                gmailService.createService({
                    provider: 'gmail',
                    email: userInfo.email,
                    authParams: {
                        access_token: '',
                        refresh_token: ''
                    }
                })

            }
            res.status(200).json({ tokens: resTokens })
        } catch (error) {
            res.status(401).json({ message: "non autorizzato" })
        }
    }
}
export default EmailController