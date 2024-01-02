import EventEmitter from "events";
import Services from "src/Entities/Services.entity";
import ServiceModel from '@Entities/Services.entity'
import { database } from "src/DataSources";
import { Repository } from "typeorm";
import MailComposer from 'nodemailer/lib/mail-composer'

type EmailServiceParams = {
    id_service?: string
}


class EmailService<AuthParams> extends EventEmitter {
    public service_type: string
    public service_name: string
    public id_service?: string
    public serviceModel: ServiceModel<AuthParams>
    public serviceRepository: Repository<ServiceModel<AuthParams>>
    constructor({
        id_service
    }: EmailServiceParams = {}) {
        super();
        this.serviceModel = new ServiceModel<AuthParams>()
        this.id_service = id_service ? id_service : undefined
        this.serviceRepository = database.getRepository(ServiceModel<AuthParams>)
        this.service_name = 'gmail'
    }

    sandMail() { }

    async getServiceInfo() {
        const serviceInfo: Services<AuthParams> | null = await this.serviceRepository.findOne({
            where: {
                id_service: this.id_service
            }
        })

        return serviceInfo
    }
    encodeMessage(message: any) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    authenticate(_AuthParams:AuthParams): any {
            return new Error("Override authenticate() method with your logic")
    }
    async createMail(options: any) {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    };
}
export default EmailService