import config from './config.json'
import router from './router'
import GoogleEmailService from './service'

type ProviderConfigProps = {
    id: string,
    name: string,
    provider:string,
    version:string
}


class GmailProvider {
    config: ProviderConfigProps

    constructor() {
    }

    init() {
        this.config = config
    }
    getRouter() {
        return router
    }
    getServiceClass() {
        return GoogleEmailService
    }
    getVersion() {
        return this.config.version as string
    }

}
export default GmailProvider