import config from './config.json'
import router from './router'
import GmailController from './controller'
import GoogleEmailService from './service'
class GmailProvider{
    config:Object
    
    constructor(){
        
    }

    init(){
        this.config = config
    }
    getRouter(){
        return router
    }
    getController(){
        const gmailController = new GmailController()
        return gmailController
    }
    getServiceInstance(){

        const gmailService = new GoogleEmailService()
       
        return gmailService
    }

}
export default GmailProvider