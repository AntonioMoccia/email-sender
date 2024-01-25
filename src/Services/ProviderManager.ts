import { Application } from "express"
import { Repository } from "typeorm";
import ServiceModel from '@Models/services.entity'
import { database } from "..//DataSources";

import Gmail from '@providers/gmail/service'


class ProviderManager {
    id_service:string
    public serviceModel: ServiceModel
    public serviceRepository: Repository<ServiceModel>

    constructor(){
        this.serviceModel = new ServiceModel()
        //      this.id_service = id_service ? id_service : undefined
        this.serviceRepository = database.getRepository(ServiceModel)
    }

    private async getService(){
        if(!this.id_service){
            throw new Error('id_service is undefined')
        }
        else{
            try {
                const service = await this.serviceRepository.findOne({
                    where:{
                        id_service:this.id_service
                    }
                })
                return service
            } catch (error) {
                throw new Error(`No info about ${this.id_service} service `)
            }
         
        }
    }
    setIdService(id_service:string){
        this.id_service = id_service
        return this
    }

    async createProvider(){
        console.log(this.id_service);
        
        const service = await this.getService()

        switch(service?.provider){
            case 'gmail':
                return new Gmail({id_service:this.id_service})
            
        }
    }

}

export default ProviderManager


/*    providers: any
   app: Application
*/
/*     constructor({ app }: ProviderManagerProps) {
       this.app = app
       this.providers = {}
   } */

/*   use(ProviderClass: { new(): any }) {
      const provider = new ProviderClass()
      provider.init()
      const router = provider.getRouter()

      /**map router to express app */
/*  this.app.use(`/v1/providers/${provider.config.provider}`, router)
 this.providers[provider.config.name] = provider */

//configurare rotte di default sui metodi di default con l'inserimento di :type/default_route

/*   return this.providers
}
*/
/*    getProviders() {
       return this.providers
   }  */