import config from './config.json'
import router from './router'

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

}
export default GmailProvider