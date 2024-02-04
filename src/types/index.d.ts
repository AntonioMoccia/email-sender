import Auth from "@Services/Auth.service"
import { Request, Express } from 'express'

export type SandEmailArgs = {
    name:string
    email:string
    number:string
    text:string
    subject:string
    service_type:string
}
export type GoogleEmailServiceProps = {
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    refresh_token: string
}
export type Service={
    id_service: string,
    email:string,
    provider: string,
    authParams: any
}
export interface EmailBase {
    sandEmail(): () => boolean
}