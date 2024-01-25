import EventEmitter from "events";
import ServiceModel from '@Models/services.entity'
import { database } from "src/DataSources";
import { Repository } from "typeorm";
import MailComposer from 'nodemailer/lib/mail-composer'

type EmailServiceParams = {
    id_service?: string
}

class EmailService extends EventEmitter {


    public provider: string
    public name: string
    public id_service?: string
    public serviceModel: ServiceModel
    public serviceRepository: Repository<ServiceModel>


    constructor({

    }: EmailServiceParams = {}) {
        super();
        this.serviceModel = new ServiceModel()
        //      this.id_service = id_service ? id_service : undefined
        this.serviceRepository = database.getRepository(ServiceModel)

    }

    sandMail() { }
    async createService(params: ServiceModel): Promise<ServiceModel | Error> {
        try {
            this.serviceModel = { ...params }
            this.serviceModel.authParams = params.authParams
            const newService = await this.serviceRepository.save(this.serviceModel)
            return newService
        } catch (error) {
            return new Error("Insert service error")
        }
    }
    setIdService(id_service:string){
        this.id_service = id_service
    }
    async getServiceInfo() {
        try {
            const serviceInfo: ServiceModel | null = await this.serviceRepository.findOne({
                where: {
                    id_service: this.id_service
                }
            })
            if (!serviceInfo) {
                throw new Error(`No info about ${this.id_service} service `)
            }
            this.setIdService(serviceInfo.id_service as string)
            this.provider = serviceInfo.provider
    
            
            return serviceInfo

        } catch (error) {
            throw new Error(`No info about ${this.id_service} service `)
        }


    }
    encodeMessage(message: any) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    authenticate(_AuthParams: any): any {
        return new Error("Override authenticate() method with your logic")
    }
    async createMail(options: any) {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    };
}
export default EmailService