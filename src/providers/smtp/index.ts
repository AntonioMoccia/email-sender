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