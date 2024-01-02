import nodemailer from "nodemailer";
import { google, Auth } from "googleapis"
import Services from "src/Entities/Services.entity";
import { database } from "src/DataSources";
import { Repository } from "typeorm";
import MailComposer from 'nodemailer/lib/mail-composer'
const access_token = 'ya29.a0AfB_byDA8NyzVnXmq7QZP3vL6So7mnIwHajuy4VxuErUp_95FhtpxrYGPsxwkdpDlyRSF6xBL2ulU04m22DDuUb0N381K1tJ_GyjnSSFhIWPzpEh9Q38ydN1oA3LxyEqfyXgz7-XZ8KO1csfR2HLkEvcZ5SJ84bQrnODaCgYKARUSARMSFQHGX2MiwOp_nXThFTWzsm-5cmrHag0171'
const refresh_token = '1//090ZwTJUN0U1dCgYIARAAGAkSNwF-L9IruTtbcMt5iR-p0YdFm9VfmTgNUxIZlotBLrNygmo07rGckAl-pdCdB8lpUtXH9-xc-sc'

const OAuth2 = google.auth.OAuth2;


class GoogleEmailService {
    oauth2Client: Auth.OAuth2Client
    public name: string = 'gmail'
    serviceRepo: Repository<Services>
    constructor(
        private client_id: string,
        private client_secret: string,
        private redirect_uri: string,
        private refresh_token?: string,
        private email?: string,
        public isAuthenticated?: string
    ) {
        this.oauth2Client = new OAuth2(
            this.client_id,
            this.client_secret,
            this.redirect_uri
        );

        this.serviceRepo = database.getRepository(Services)
        this.oauth2Client.setCredentials({
            access_token, refresh_token
        })
        this.getServiceInfo()
   
    }

    

    encodeMessage(message: any) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    async createMail(options: any) {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    };

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

    generateAuthUrl() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile openid',
            prompt: 'consent'
        })

        return authUrl
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
    }
}


export default GoogleEmailService