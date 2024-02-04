import { google, Auth } from "googleapis"
import Services from "@models/mongo/services.model"
import Provider from "@services/Provider.service";
import { Application } from "express";

const OAuth2 = google.auth.OAuth2;


type GoogleEmailServiceParams = {
    id_service?: string
}

class GmailProvider extends Provider {

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
    async getTokensByCode(code: string) {
        const tokens = await this.oauth2Client.getToken(code)
        return tokens
    }
    async refreshToken(): Promise<Auth.Credentials | any> {
        try {
            const refreshToken = await this.oauth2Client.refreshAccessToken()
            return refreshToken.credentials
        } catch (error) {
            return error
        }

    }
    async updateService(id_service: string, params: any) {
        try {
            const existingService = await Services.findOneAndUpdate({ id_service }, { ...params })

            return existingService

        } catch (error) {
            return new Error("Update service error")
        }
    }
    async authenticate() {
        console.log('serviceInfo');
        const serviceInfo = await this.getServiceInfo()

        console.log('serviceInfo',serviceInfo);
        

        if (!(serviceInfo instanceof Error)) {
            console.log('authentication...');
            const expire = serviceInfo.authParams.expires_in
            this.oauth2Client.setCredentials({
                access_token: serviceInfo.authParams.access_token,
                refresh_token: serviceInfo.authParams.refresh_token
            })
            if (expire - Date.now() < 0) {
                const credentials: Auth.Credentials = await this.refreshToken()
                console.log('serviceInfo',credentials);
                this.oauth2Client.setCredentials({
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token
                })
                //update after refresh token
                await this.updateService(this.id_service as string, { authParams: { access_token: credentials.access_token as string, refresh_token: credentials.refresh_token as string, expires_in: credentials.expiry_date as number } })

                this.is_authenticated = true
            } else {
                this.is_authenticated = true
            }
        }
    }
    async sendEmail() {


        await this.authenticate()
/*         if (!this.is_authenticated) {
        }
 */        console.log('sanding email...');
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
            console.log('userInfo', userInfo);

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
    /*   async delete(id_service: string) {
          try {
              const deleted = await this.serviceRepository.delete({ id_service })
              return deleted
          } catch (error) {
              throw new Error('Cannot delete this service')
          }
      }
   */
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


export default GmailProvider