import nodemailer from "nodemailer";
import { google, Auth } from "googleapis"
import Services from "src/Entities/Services.entity";
import { database } from "src/DataSources";
import { Repository } from "typeorm";
import BaseEmailService from "@Services/BaseEmailService.service";

const OAuth2 = google.auth.OAuth2;
type AuthParamsGoogle = {
    access_token: string
    refresh_token: string
}
class GoogleEmailService extends BaseEmailService<AuthParamsGoogle> {


    private oauth2Client: Auth.OAuth2Client
    constructor() {
        super()
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://127.0.0.1:5000/service/google/oauth"
        )
    }
    async createService(): Promise<Services<AuthParamsGoogle> | Error> {
        try {
            this.serviceModel.service_type = 'gmail'
            this.serviceModel.authParams = {
                access_token: "ihasdfvajshdfvasdf",
                refresh_token: "khjvaskjdvfjasdhvf"
            }

            const newService = await this.serviceRepository.save(this.serviceModel)
            return newService
        } catch (error) {
            return new Error("Insert service error")
        }
    }
    generateAuthUrl() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile openid',
            prompt: 'consent'
        })

        return authUrl
    }



    /* 
        async sandEmail(template?: string, params?: any) {
    
            try {
                const options = {
                    to: 'moccia.ant@gmail.com',
                    cc: '',
                    replyTo: '',
                    subject: 'Hello Amit 🚀',
                    text: 'This email is sent from the command line',
                    html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from <a href="https://digitalinspiration.com">Digital Inspiration</a>.</p>`,
                    textEncoding: 'base64',
                    headers: [
                        { key: 'X-Application-Developer', value: 'Amit Agarwal' },
                        { key: 'X-Application-Version', value: 'v1.0.0.2' },
                    ]
                }
                const rawMessage = await this.createMail(options);
                const sandEMail = await google.gmail({ version: 'v1', auth: this.oauth2Client }).users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: rawMessage
                    }
                })
    
                console.log(sandEMail.status);
    
            } catch (error) {
                console.log(error);
            }
    
        }
        async getUserData(access_token: string) {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
            const data = await response.json()
    
            return data
    
        }
        async getServiceInfo() {
            const service = await this.serviceRepo.findOne({
                where: {
                    id_service: "e3e0f455-7389-44c8-9d3c-0db63d1cf873"
                }
            })
    
            return service
        }
    

    
        async createTransporter() {
            const token = this.oauth2Client.credentials.access_token
    
            const accessToken = await this.createToken()
    
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    auth: {
                        type: "OAuth2",
                        user: "pinalina455@gmail.com",
                        accessToken: accessToken,
                        clientId: this.client_id,
                        clientSecret: this.client_secret,
                        refreshToken: refresh_token,
                        expires: 3600,
                    }
                });
                return transporter
            } catch (error) {
                console.log(error);
            }
        }
    
        private async createToken(): Promise<string> {
            const accessToken: string = await new Promise((resolve, reject) => {
    
                this.oauth2Client.getAccessToken((err, token) => {
    
                    if (err) {
                        reject("Failed to create access token :(");
                    }
                    if (token) {
                        resolve(token);
                    }
                    else {
                        reject("Failed to create access token :(");
                    }
                });
            });
            return accessToken
        } */
}


export default GoogleEmailService