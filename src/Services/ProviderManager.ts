import { Application, Express, Router } from "express"


type ProviderManagerProps = {
    app: Application
}

class ProviderManager {
    providers: any
    app: Application
    forbiddenRoutes: string[]

    constructor({ app }: ProviderManagerProps) {
        this.app = app
        this.providers = {}
        this.forbiddenRoutes = [
            '/sand-email',
            '/update',
            '/login',
            '/logout'
        ]
    }


    verifyRoutes(router: Router) {
        const verify = router.stack.map(stack => {
            return this.forbiddenRoutes.includes(stack.route.path)
        })
        if (verify.length > 0) {
            return false
        }
        return true
    }

    mapRoutes() {

    }

    use(provider: { new(): any }) {
        const providerInstance = new provider()
        providerInstance.init()
        const router = providerInstance.getRouter()



        const validRoutes = this.verifyRoutes(router); //convalida router aggiuntivi del provider
        if (validRoutes) {
            throw new Error(`Non è possibile modificare i seguenti path ${this.forbiddenRoutes.join(', ')}`)
        }
        console.log(providerInstance.config.type);
        
        /**map router to express app */
        this.app.use(`/providers/${providerInstance.config.type}`, router)
        this.configureRoutes(providerInstance)
        this.providers[providerInstance.config.type] = providerInstance
        const service = providerInstance.getServiceInstance()

        //configurare rotte di default sui metodi di default con l'inserimento di :type/default_route

        return this.providers
    }


    configureRoutes(provider: any) {
        return this.app.post(`/providers/${provider.config.type}/login`, provider.getController().login)
    }
    getProviders() {
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