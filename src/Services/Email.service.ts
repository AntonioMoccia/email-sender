import EventEmitter from "events";
import ServiceModel from '@Entities/Services.entity'
import { database } from "src/DataSources";
import { Repository } from "typeorm";
import MailComposer from 'nodemailer/lib/mail-composer'

type EmailServiceParams = {
    id_service?: string
}

class EmailService<AuthParams> extends EventEmitter {


    public provider: string
    public name: string
    public id_service?: string
    public serviceModel: ServiceModel<AuthParams>
    public serviceRepository: Repository<ServiceModel<AuthParams>>


    constructor({

    }: EmailServiceParams = {}) {
        super();
        this.serviceModel = new ServiceModel<AuthParams>()
        //      this.id_service = id_service ? id_service : undefined
        this.serviceRepository = database.getRepository(ServiceModel<AuthParams>)

    }

    sandMail() { }
    async createService(params: ServiceModel<AuthParams>): Promise<ServiceModel<AuthParams> | Error> {
        try {
            this.serviceModel = { ...params }
            this.serviceModel.authParams = params.authParams
            const newService = await this.serviceRepository.save(this.serviceModel)
            return newService
        } catch (error) {
            return new Error("Insert service error")
        }
    }

    async getServiceInfo() {
        try {
            const serviceInfo: ServiceModel<AuthParams> | null = await this.serviceRepository.findOne({
                where: {
                    id_service: this.id_service
                }
            })
            if (!serviceInfo) {
                return new Error(`No info about ${this.id_service} service `)
            }
            this.id_service = serviceInfo.id_service
            this.provider = serviceInfo.provider
            return serviceInfo

        } catch (error) {
            return new Error(`No info about ${this.id_service} service `)
        }


    }
    encodeMessage(message: any) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    authenticate(_AuthParams: AuthParams): any {
        return new Error("Override authenticate() method with your logic")
    }
    async createMail(options: any) {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    };
}
export default EmailService