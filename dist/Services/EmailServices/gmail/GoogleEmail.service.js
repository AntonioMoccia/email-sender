"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const Services_entity_1 = __importDefault(require("src/Entities/Services.entity"));
const DataSources_1 = require("src/DataSources");
const mail_composer_1 = __importDefault(require("nodemailer/lib/mail-composer"));
const access_token = 'ya29.a0AfB_byDA8NyzVnXmq7QZP3vL6So7mnIwHajuy4VxuErUp_95FhtpxrYGPsxwkdpDlyRSF6xBL2ulU04m22DDuUb0N381K1tJ_GyjnSSFhIWPzpEh9Q38ydN1oA3LxyEqfyXgz7-XZ8KO1csfR2HLkEvcZ5SJ84bQrnODaCgYKARUSARMSFQHGX2MiwOp_nXThFTWzsm-5cmrHag0171';
const refresh_token = '1//090ZwTJUN0U1dCgYIARAAGAkSNwF-L9IruTtbcMt5iR-p0YdFm9VfmTgNUxIZlotBLrNygmo07rGckAl-pdCdB8lpUtXH9-xc-sc';
const OAuth2 = googleapis_1.google.auth.OAuth2;
class GoogleEmailService {
    client_id;
    client_secret;
    redirect_uri;
    refresh_token;
    email;
    isAuthenticated;
    oauth2Client;
    name = 'gmail';
    serviceRepo;
    constructor(client_id, client_secret, redirect_uri, refresh_token, email, isAuthenticated) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;
        this.refresh_token = refresh_token;
        this.email = email;
        this.isAuthenticated = isAuthenticated;
        this.oauth2Client = new OAuth2(this.client_id, this.client_secret, this.redirect_uri);
        this.serviceRepo = DataSources_1.database.getRepository(Services_entity_1.default);
        this.oauth2Client.setCredentials({
            access_token, refresh_token
        });
        this.getServiceInfo();
    }
    encodeMessage(message) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    ;
    async createMail(options) {
        const mailComposer = new mail_composer_1.default(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    }
    ;
    async sandEmail(template, params) {
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
            };
            const rawMessage = await this.createMail(options);
            const sandEMail = await googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client }).users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: rawMessage
                }
            });
            console.log(sandEMail.status);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getUserData(access_token) {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const data = await response.json();
        return data;
    }
    async getServiceInfo() {
        const service = await this.serviceRepo.findOne({
            where: {
                id_service: "e3e0f455-7389-44c8-9d3c-0db63d1cf873"
            }
        });
        return service;
    }
    generateAuthUrl() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.profile openid',
            prompt: 'consent'
        });
        return authUrl;
    }
    async createTransporter() {
        const token = this.oauth2Client.credentials.access_token;
        const accessToken = await this.createToken();
        try {
            const transporter = nodemailer_1.default.createTransport({
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
            return transporter;
        }
        catch (error) {
            console.log(error);
        }
    }
    async createToken() {
        const accessToken = await new Promise((resolve, reject) => {
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
        return accessToken;
    }
}
exports.default = GoogleEmailService;
