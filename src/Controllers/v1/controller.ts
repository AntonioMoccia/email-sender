import ProviderManager from '@services/ProviderManager'
import { Request, Response, NextFunction } from 'express'


class Controller {
    constructor() {
        
    }
    
    static async sendEmail(req: Request, res: Response, next: NextFunction) {
        const providerManager = new ProviderManager()
     
        const provider= await providerManager.setIdService(String(req.query.id_service)).createProvider()

        const status = await provider?.sendEmail()
        
        
        res.json({msg:status})
    }


}

export default Controller