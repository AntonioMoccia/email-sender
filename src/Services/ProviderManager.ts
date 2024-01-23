import { Application, Express } from "express"


type ProviderManagerProps={
    app:Application
}

class ProviderManager {
    providers: any
    app:Application

    constructor({app}:ProviderManagerProps) {
        this.app = app
        this.providers = {}
    }

    use(provider: { new(): any }) {
        const providerInstance = new provider()
        providerInstance.init()
        const router = providerInstance.getRouter()
        /**map router to express app */
        this.app.use(`/providers/${providerInstance.config.name}`,router)
        this.providers[providerInstance.config.name]=providerInstance
        return this.providers
    }
    getProviders(){
        return this.providers
    }
    /*     readProvidersFolder() {
            const providersPath = path.resolve(__dirname, 'EmailServices')
            const providers = readdirSync(providersPath)
            providers.forEach(providerFolderName => {
                const providerPath = path.resolve(providersPath, providerFolderName)
                const provider = require(providerPath)
                console.log(provider);
    
                this.providers[provider.data.name] = provider.default
                console.log(this.providers); 
            })
    
        } */

}

export default ProviderManager