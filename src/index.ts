import { config } from 'dotenv'
config()
import "reflect-metadata"
import express, { Application, Request, Response, NextFunction } from 'express'
import dns from 'dns'
import { database } from "./DataSources"
import Auth from "@Services/Auth.service"
import path from 'path'
import EmailRouter from '@Routers/Email.router'
import ProviderManager from '@Services/ProviderManager'

import GmailProvider from '@Services/providers/gmail'

declare global {
    namespace Express {
        interface Request {
            auth: Auth,
            internalParams:any
        }
    }
}

const app: Application = express()

async function InitDatabase() {
    await database.initialize()
}



/* 
app.use('/email',EmailRouter) */



const providerManager = new ProviderManager({app})

providerManager.use(GmailProvider)

const InitServicesMiddelware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = new Auth(req)
    req.auth = auth
    next()
}
 
app.use(express.json())
app.use(InitServicesMiddelware)
InitDatabase()

const hosts: string[] = [
    'WP016.ekd.local'
]



app.post('/sand-email', async (req: Request, res: Response) => {

    res.send('hello world')
})

app.listen(5000, () => {
    console.log(`http://localhost:5000`);
})
