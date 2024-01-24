import { Request, Response, NextFunction, Router } from 'express'
import GmailService from "@Services/providers/gmail/service"

interface ProviderController {
    sandEmail: (req: Request, res: Response, next: NextFunction) => void,
    login: (req: Request, res: Response, next: NextFunction) => void
}

class GmailController implements ProviderController {

    gmailService: GmailService

    constructor() {
        this.gmailService = new GmailService()
    }
    hello(req: Request, res: Response, next: NextFunction) {
        res.send('Hello to Gmail Provider')
    }
    async sandEmail(req: Request, res: Response, next: NextFunction) {
        if(!req.query.id_service){
            return res.sendStatus(404).json({
                msg:"id_service is null"
            })
        }
   
        
        const initService = new GmailService({ id_service: req.query.id_service as string })

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
        try {
            const tokenInfo = await initService.getToken(String(serviceInfo?.authParams.access_token))
        } catch (error) {
            initService.refreshToken()
        }


        const sand = await initService.sandEmail()

        res.json(sand)
    }
    login(req: Request, res: Response, next: NextFunction) {
        const service = new GmailService()
        const authUrl = service.generateAuthUrl(req.query.id_service as string)

        res.json({ url: authUrl })
    }
    async redirect(req: Request, res: Response, next: NextFunction) {
        const service_id = req.query.state ? JSON.parse(String(req.query.state)).service_id : undefined
        const gmailService = new GmailService()

        try {
            const resTokens = await gmailService.getTokensByCode(String(req.query.code))
            const userInfo = await gmailService.getUserInfo(String(resTokens.tokens.access_token))
            
            if (service_id) {
                console.log(userInfo);
                gmailService.updateService(service_id, {
                    provider:'gmail',
                    email: userInfo.email,
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
                        access_token: String(resTokens.tokens.access_token),
                        refresh_token: String(resTokens.tokens.refresh_token)
                    }
                })

            }
            res.sendStatus(200).end()/* .json({ tokens: resTokens }) */
        } catch (error) {
            res.status(401).json({ message: "non autorizzato" })
        }
    }
}

export default GmailController