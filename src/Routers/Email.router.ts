import EmailController from '@Controllers/Email.controller'
import { Router } from 'express'

export const basePath = '/'
export const router = Router()

router.post('/email/sand', EmailController.sandEmail)