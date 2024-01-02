import nodemailer from "nodemailer";
import { google, Auth } from "googleapis"
import Services from "src/Entities/Services.entity";
import { database } from "src/DataSources";
import { Repository } from "typeorm";
import EmailService from "@Services/Email.service";

const OAuth2 = google.auth.OAuth2;
type AuthParamsGoogle = {
    access_token: string
    refresh_token: string
}
type CreateServiceParams = {
    authParams: AuthParamsGoogle
}

type GoogleEmailServiceParams = {
    id_service?: string
}

class GoogleEmailService extends EmailService<AuthParamsGoogle> {

    private oauth2Client: Auth.OAuth2Client
    public id_service?: string
    public is_authenticated?: boolean

    constructor({
        id_service
    }: GoogleEmailServiceParams = {}) {
        super()
        this.id_service = id_service ? id_service : undefined
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://127.0.0.1:5000/email/sand/login/google/oauth"
        )
    }
    async sandEmail() {
        if(!this.is_authenticated) return new Error("you are not authenticated")

        
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
            const sandEmail = await google.gmail({ version: 'v1', auth: this.oauth2Client }).users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: rawMessage
                }
            })
            return sandEmail.status

        } catch (error) {
            console.log(error);
        }
    }
    async getServiceInfo(): Promise<Services<AuthParamsGoogle> | null> {
        const serviceInfo = await this.serviceRepository.findOneBy({ id_service: this.id_service })
        return serviceInfo
    }
    async getTokens(code: string) {
        const tokens = await this.oauth2Client.getToken(code)

        return tokens
    }
    async createService(params: CreateServiceParams): Promise<Services<AuthParamsGoogle> | Error> {
        try {
            this.serviceModel.service_type = 'gmail'
            this.serviceModel.authParams = params.authParams
            const newService = await this.serviceRepository.save(this.serviceModel)
            return newService
        } catch (error) {
            return new Error("Insert service error")
        }
    }
    async authenticate(authParams: AuthParamsGoogle) {
        this.oauth2Client.setCredentials({
            access_token: authParams.access_token,
            refresh_token: authParams.refresh_token
        })
        console.log('authentication...');
        
        
        try {
            const userInfo = await this.getUserInfo(authParams.refresh_token)
            this.is_authenticated=true
            return userInfo
        } catch (error) {
            console.log(error);
        }
        return true
    }
    generateAuthUrl() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile openid',
            prompt: 'consent'
        })

        return authUrl
    }
    async getUserInfo(access_token: string) {
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
            const data = await response.json()
            return data
        } catch (error) {
            return error
        }
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