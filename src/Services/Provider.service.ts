import EventEmitter from "events";
import ServiceModel from '@models/services.entity'
import { database } from "../data-sources";
import { Repository } from "typeorm";
import MailComposer from 'nodemailer/lib/mail-composer'
import Services from '@models/mongo/services.model'
import {v4 as uuid} from "uuid";
import { Service } from "src/types";
type EmailServiceParams = {
    id_service?: string
}

class EmailService extends EventEmitter {


    public provider: string
    public id_service?: string
    name: string



    constructor({

    }: EmailServiceParams = {}) {
        super();
    }

    sandMail() { }
    async createService(params: ServiceModel): Promise<any> {
        try {
            const newServiceMongo = new Services({
                id_service:uuid(),
                ...params
            })
             const newService = await newServiceMongo.save()
                
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

            const serviceInfo = await Services.findOne({id_service:this.id_service}).exec()
            console.log('inside function',serviceInfo);
            
/*             const serviceInfo: ServiceModel | null = await this.serviceRepository.findOne({
                where: {
                    id_service: this.id_service
                }
            }) */
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