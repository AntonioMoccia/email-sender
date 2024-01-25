"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const Email_service_1 = __importDefault(require("../../Services/Email.service"));
const OAuth2 = googleapis_1.google.auth.OAuth2;
class GoogleEmailService extends Email_service_1.default {
    oauth2Client;
    is_authenticated;
    app;
    constructor({ id_service, } = {}) {
        super();
        this.id_service = id_service ? id_service : undefined;
        this.oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://127.0.0.1:5000/providers/gmail/login/google/oauth");
        // console.log(this.getBaseUrl());
    }
    async refreshToken() {
        try {
            const refreshToken = await this.oauth2Client.refreshAccessToken();
            return refreshToken.credentials;
        }
        catch (error) {
            return error;
        }
    }
    async getToken(access_token) {
        const newAccessToken = await this.oauth2Client.getAccessToken();
        try {
            const userInfo = await this.getUserInfo(String(newAccessToken.token));
            const tokenInfo = await this.oauth2Client.getTokenInfo(String(newAccessToken.token));
            return tokenInfo;
        }
        catch (error) {
            const refresh_token = this.oauth2Client.refreshAccessToken();
        }
    }
    async sandEmail() {
        if (!this.is_authenticated)
            return new Error("you are not authenticated");
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
            };
            const userInfo = await this.getUserInfo(this.oauth2Client.credentials.access_token);
            console.log(userInfo);
            const rawMessage = await this.createMail(options);
            const sandEmail = await googleapis_1.google.gmail({ version: 'v1', auth: this.oauth2Client }).users.messages.send({
                userId: userInfo.id,
                requestBody: {
                    raw: rawMessage
                }
            });
            return sandEmail.status;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getTokensByCode(code) {
        const tokens = await this.oauth2Client.getToken(code);
        return tokens;
    }
    async updateService(id_service, params) {
        try {
            const existingService = await this.serviceRepository.update({ id_service }, { email: params.email, provider: params.provider, authParams: params.authParams });
            return existingService.raw;
        }
        catch (error) {
            return new Error("Insert service error");
        }
    }
    async authenticate(authParams) {
        this.oauth2Client.setCredentials({
            access_token: authParams.access_token,
            refresh_token: authParams.refresh_token
        });
        console.log('authentication...');
        try {
            const userInfo = await this.oauth2Client.getTokenInfo(authParams.access_token);
            //  const token = await this.getToken(authParams.access_token)
            this.is_authenticated = true;
            return userInfo;
        }
        catch (error) {
            const credentials = await this.refreshToken();
            this.oauth2Client.setCredentials({
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token
            });
            await this.updateService(this.id_service, { authParams: { access_token: credentials.access_token, refresh_token: credentials.refresh_token } });
            await this.getServiceInfo();
            const userInfo = await this.oauth2Client.getTokenInfo(credentials.access_token);
            //  const token = await this.getToken(authParams.access_token)
            this.is_authenticated = true;
            return userInfo;
        }
        return true;
    }
    login() {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send', ' https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'],
            prompt: 'consent',
        });
        return authUrl;
    }
    update(service_id) {
        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.send', ' https://www.googleapis.com/auth/userinfo.email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile'],
            prompt: 'consent',
            state: JSON.stringify({
                service_id
            })
        });
        return authUrl;
    }
    async getUserInfo(access_token) {
        try {
            const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = GoogleEmailService;
