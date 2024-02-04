import Services from "@models/mongo/services.model"
import Provider from "@services/Provider.service";
import nodemailer from 'nodemailer'
import { v4 as uuid } from 'uuid'


type SMTPParams = {
    id_service?: string
}

class SMTP extends Provider {

    provider = 'smtp'

    constructor({ id_service }: SMTPParams = {}) {
        super()
        this.id_service = id_service
    }
    async login(host: string, port: number, user: string, password: string) {
        const service = await new Services({
            id_service: uuid(),
            provider: this.provider,
            email: user,
            authParams: {
                host, port, password
            }
        }).save()
        return service
    }
    update(service_id: string) {

    }

    async sendEmail() {
        const serviceInfo = await this.getServiceInfo()


        try {
            const transporter = nodemailer.createTransport({
                host: serviceInfo.authParams.host,
                port: serviceInfo.authParams.port,
                auth: {
                    user: serviceInfo.email,
                    pass: serviceInfo.authParams.password
                }
            })
            var mailOptions = {
                from: serviceInfo.email,
                to: 'moccia.ant@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
            };

            transporter.sendMail(mailOptions, (e, i) => {
                console.log(e);
                console.log(i);
            })
            return 200
        } catch (error) {
            console.log(error);
        }

    }


}


export default SMTP