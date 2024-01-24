import config from './config.json'
import router from './router'
import GmailController from './controller'
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

    }

}
export default GmailProvider