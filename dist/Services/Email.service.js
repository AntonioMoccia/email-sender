"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const Services_entity_1 = __importDefault(require("../Entities/Services.entity"));
const DataSources_1 = require("src/DataSources");
const mail_composer_1 = __importDefault(require("nodemailer/lib/mail-composer"));
class EmailService extends events_1.default {
    provider;
    name;
    id_service;
    serviceModel;
    serviceRepository;
    constructor({} = {}) {
        super();
        this.serviceModel = new Services_entity_1.default();
        //      this.id_service = id_service ? id_service : undefined
        this.serviceRepository = DataSources_1.database.getRepository((Services_entity_1.default));
    }
    sandMail() { }
    async createService(params) {
        try {
            this.serviceModel = { ...params };
            this.serviceModel.authParams = params.authParams;
            const newService = await this.serviceRepository.save(this.serviceModel);
            return newService;
        }
        catch (error) {
            return new Error("Insert service error");
        }
    }
    setIdService(id_service) {
        this.id_service = id_service;
    }
    async getServiceInfo() {
        try {
            const serviceInfo = await this.serviceRepository.findOne({
                where: {
                    id_service: this.id_service
                }
            });
            if (!serviceInfo) {
                return new Error(`No info about ${this.id_service} service `);
            }
            this.id_service = serviceInfo.id_service;
            this.provider = serviceInfo.provider;
            return serviceInfo;
        }
        catch (error) {
            return new Error(`No info about ${this.id_service} service `);
        }
    }
    encodeMessage(message) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    ;
    authenticate(_AuthParams) {
        return new Error("Override authenticate() method with your logic");
    }
    async createMail(options) {
        const mailComposer = new mail_composer_1.default(options);
        const message = await mailComposer.compile().build();
        return this.encodeMessage(message);
    }
    ;
}
exports.default = EmailService;
