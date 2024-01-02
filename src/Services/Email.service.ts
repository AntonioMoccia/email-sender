import GoogleEmailService from '@Services/EmailServices/gmail/service.service'
import { readdirSync } from 'fs'
import path from 'path'
import { SandEmailArgs } from 'src/types'


class EmailService  {
    googleEmailService: GoogleEmailService
    constructor() {
        this.googleEmailService = new GoogleEmailService(
            process.env.GOOGLE_CLIENT_ID as string,
            process.env.GOOGLE_CLIENT_SECRET as string,
            process.env.GOOGLE_REFRESH_TOKEN as string,
            process.env.GOOGLE_EMAIL as string,
            process.env.GOOGLE_PASS as string
        )
    }

    initServices() {

    }

    async sandEmail({
        name,
        email,
        number,
        text,
        subject,
        service_type
    }: SandEmailArgs) {
        const transporter = await this.googleEmailService.createTransporter()
        if(!transporter) return 

        await this.googleEmailService.sandEmail()

/*         try {
            await transporter.sendMail({
                from: 'moccia.ant@gmail.com',
                to: 'moccia.ant@gmail.com',
                html: `
            <h4>Nuova email da: </h4> ${name}<br />    
            <h4>email: </h4> ${email}<br />
            <h4>phon number: </h4> ${number}<br />
            <br />
            <h1> Testo email </h1><br />              
            <p>${text}</p>`,
                subject: `${subject}`
            });
            return {
                message: 'email sanded'
            }
        } catch (error) {
            throw new Error('qualcosa è andato storto')
        }
        */
    } 
}

export default EmailService