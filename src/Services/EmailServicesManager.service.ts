import { readdirSync } from "fs"
import path from "path"

type EmailServicesManagerProps = {
    servicesRootFolder: string
}

class EmailServicesManager {

    servicesRootFolder:string

    constructor({ servicesRootFolder }: EmailServicesManagerProps) {
        this.servicesRootFolder = servicesRootFolder
    }

    readRootFolder(){
        readdirSync(this.servicesRootFolder).forEach(emailServiceFolder =>{
           const emailService = path.resolve(this.servicesRootFolder,emailServiceFolder)
            readdirSync(emailService).forEach(service=>{
                if(service.endsWith('.service.ts') || service.endsWith('.service.js')){
                    const Service = require(path.resolve(emailService,service)).default
                    const instance = new Service()
                    console.log(instance.service_name);
                    
                }
            })
        })
    }
}
export default EmailServicesManager