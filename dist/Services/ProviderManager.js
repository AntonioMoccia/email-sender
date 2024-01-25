"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProviderManager {
    providers;
    app;
    forbiddenRoutes;
    constructor({ app }) {
        this.app = app;
        this.providers = {};
        this.forbiddenRoutes = [
            '/sand-email',
            '/update',
            '/login',
            '/logout'
        ];
    }
    verifyRoutes(router) {
        const verify = router.stack.map(stack => {
            return this.forbiddenRoutes.includes(stack.route.path);
        });
        if (verify.length > 0) {
            return false;
        }
        return true;
    }
    mapRoutes() {
    }
    use(provider) {
        const providerInstance = new provider();
        providerInstance.init();
        const router = providerInstance.getRouter();
        /*
                const validRoutes = this.verifyRoutes(router); //convalida router aggiuntivi del provider
                if (validRoutes) {
                    throw new Error(`Non è possibile modificare i seguenti path ${this.forbiddenRoutes.join(', ')}`)
                }
         */
        /**map router to express app */
        this.app.use(`/v1/providers/${providerInstance.config.provider}`, router);
        this.providers[providerInstance.config.name] = providerInstance;
        //configurare rotte di default sui metodi di default con l'inserimento di :type/default_route
        return this.providers;
    }
    configureRoutes(provider) {
    }
    getProviders() {
        return this.providers;
    }
}
exports.default = ProviderManager;
