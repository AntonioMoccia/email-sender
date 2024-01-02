"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleEmail_service_1 = __importDefault(require("./EmailServices/gmail/GoogleEmail.service"));
class EmailService {
    googleEmailService;
    constructor() {
        this.googleEmailService = new GoogleEmail_service_1.default(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "https://developers.google.com/oauthplayground", process.env.GOOGLE_REFRESH_TOKEN, process.env.GOOGLE_EMAIL, process.env.GOOGLE_PASS);
    }
    initServices() {
    }
    async sandEmail({ name, email, number, text, subject, service_type }) {
        const transporter = await this.googleEmailService.createTransporter();
        if (!transporter)
            return;
        await this.googleEmailService.sandEmail();
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
exports.default = EmailService;
