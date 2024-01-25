import { google, Auth } from "googleapis"
import Services from "src/Entities/Services.entity";
import EmailService from "@Services/Email.service";
import { Application } from "express";

const OAuth2 = google.auth.OAuth2;
type AuthParamsGoogle = {
    access_token: string
    refresh_token: string,
    expires_in: number
}

type CreateServiceParams = {
    provider?: string
    email?: string
    authParams: AuthParamsGoogle
}

type GoogleEmailServiceParams = {
    id_service?: string
}

class GoogleEmailService extends EmailService<AuthParamsGoogle> {

    private oauth2Client: Auth.OAuth2Client
    public is_authenticated?: boolean
    public app: Application

    constructor({ id_service }: GoogleEmailServiceParams = {}) {
        super()
        this.id_service = id_service ? id_service : undefined

        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://127.0.0.1:5000/v1/providers/gmail/google/oauth"
        )
    }
    async refreshToken(): Promise<Auth.Credentials | any> {
        try {
            const refreshToken = await this.oauth2Client.refreshAccessToken()
            return refreshToken.credentials
        } catch (error) {
            return error
        }

    }
    async sendEmail() {
        if (!this.is_authenticated) {
            const serviceInfo = await this.getServiceInfo()
            await this.authenticate(serviceInfo?.authParams)
        }
        console.log('sanding email...');
        /** CREATE EMAIL RAW AND SAND */
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
            const userInfo = await this.getUserInfo(this.oauth2Client.credentials.access_token as string)

            const rawMessage = await this.createMail(options);
            const sandEmail = await google.gmail({ version: 'v1', auth: this.oauth2Client }).users.messages.send({
                userId: userInfo.id,
                requestBody: {
                    raw: rawMessage
                }
            })

            return sandEmail.status

        } catch (error) {
            console.log(error);
        }
    }
    async getTokensByCode(code: string) {
        const tokens = await this.oauth2Client.getToken(code)

        return tokens
    }
    async updateService(id_service: string, params: CreateServiceParams): Promise<Services<AuthParamsGoogle> | Error> {
        try {
            const existingService = await this.serviceRepository.update({ id_service }, { email: params.email, provider: params.provider, authParams: params.authParams })

            return existingService.raw

        } catch (error) {
            return new Error("Update service error")
        }
    }
    async authenticate(authParams: AuthParamsGoogle) {
        const serviceInfo = await this.getServiceInfo()

        if (!(serviceInfo instanceof Error)) {
            console.log('authentication...');
            const expire = serviceInfo.authParams.expires_in
            if ((expire - Date.now()) <= 0) {
                const credentials: Auth.Credentials = await this.refreshToken()
                this.oauth2Client.setCredentials({
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token
                })
                //update after refresh token
                await this.updateService(this.id_service as string, { authParams: { access_token: credentials.access_token as string, refresh_token: credentials.refresh_token as string, expires_in: credentials.expiry_date as number } })

                this.is_authenticated = true
            } else {
                this.oauth2Client.setCredentials({
                    access_token: authParams.access_token,
                    refresh_token: authParams.refresh_token
                })
                this.is_authenticated = true
            }
        }
    }

    getLoginUrl() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send', ' https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'],
            prompt: 'consent',
        })

        return authUrl
    }
    getUpdateUrl(service_id: string) {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send', ' https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'],
            prompt: 'consent',
            state: JSON.stringify({
                service_id
            })
        })
        return authUrl
    }
    async getUserInfo(access_token: string) {
        try {
            const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`

            const response = await fetch(url)
            const data = await response.json()

            return data
        } catch (error) {
            return error
        }
    }
}


export default GoogleEmailService