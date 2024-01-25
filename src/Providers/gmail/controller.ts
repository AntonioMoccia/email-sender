import { Request, Response, NextFunction, Router } from 'express'
import GmailService from "./service"

interface ProviderController {
    sendEmail: (req: Request, res: Response, next: NextFunction) => void,
    login: (req: Request, res: Response, next: NextFunction) => void
    update: (req: Request, res: Response, next: NextFunction) => void
    delete: (req: Request, res: Response, next: NextFunction) => void
}


class GmailController implements ProviderController {

    gmailService: GmailService

    constructor() {
        this.gmailService = new GmailService()
    }
    base(req: Request, res: Response, next: NextFunction) {
        res.send('Hello from Gmail Provider')
    }
    async sendEmail(req: Request, res: Response, next: NextFunction) {
        const gmailService = new GmailService({ id_service: req.query.id_service as string })
        try {
            const response = await gmailService.sendEmail()
            res.sendStatus(200).end()
        } catch (error) {
            res.sendStatus(500).end()
        }
    }
    //ritorna l'url da aprire per fare il login
    login(req: Request, res: Response, next: NextFunction) {
        const service = new GmailService()
        const authUrl = service.getLoginUrl()

        res.json({ url: authUrl })
    }
    //ritorna l'url da aprire per fare il login
    update(req: Request, res: Response, next: NextFunction) {
        const id_service = req.query.id_service
        const service = new GmailService()
        const authUrl = service.getUpdateUrl(id_service as string)

        res.json({ url: authUrl })
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        const id_service = req.query.id_service
        const service = new GmailService()
        if (!id_service) {
            res.sendStatus(404).end()
        } else {
            try {
                await service.delete(id_service as string)
                res.sendStatus(200)
            } catch (error) {
                res.sendStatus(500)
            }
        }

    }
    async redirect(req: Request, res: Response, next: NextFunction) {
        const service_id = req.query.state ? JSON.parse(String(req.query.state)).service_id : undefined
        const gmailService = new GmailService()

        try {
            const resTokens = await gmailService.getTokensByCode(String(req.query.code))
            const userInfo = await gmailService.getUserInfo(String(resTokens.tokens.access_token))
         

            if (service_id) {
                gmailService.updateService(service_id, {
                    provider: 'gmail',
                    email: userInfo.email,
                    authParams: {
                        access_token: String(resTokens.tokens.access_token),
                        refresh_token: String(resTokens.tokens.refresh_token),
                        expires_in: Number(resTokens.tokens.expiry_date)
                    }
                })
            } else {

                await gmailService.createService({
                    provider: 'gmail',
                    email: userInfo.email,
                    authParams: {
                        access_token: String(resTokens.tokens.access_token),
                        refresh_token: String(resTokens.tokens.refresh_token),
                        expires_in: Number(resTokens.tokens.expiry_date)
                    }
                })

            }
            res.sendStatus(200).end()
        } catch (error) {
            res.status(401).json({ message: "non autorizzato" })
        }
    }
}

export default GmailController