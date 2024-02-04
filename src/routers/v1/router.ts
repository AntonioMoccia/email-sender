import {Router,NextFunction,Request,Response} from 'express'
import ControllerV1 from '@controllers/v1/controller'
import gmailRouter from '@providers/gmail/router'
import smtpRouter from '@providers/smtp/router'

const router = Router()

router.use('/providers/gmail',gmailRouter)
router.use('/providers/smtp',smtpRouter)
router.post('/send',ControllerV1.sendEmail)


export default router