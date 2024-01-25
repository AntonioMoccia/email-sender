import {Router,NextFunction,Request,Response} from 'express'
import ControllerV1 from '@Controllers/v1/controller'
import gmailRouter from '@providers/gmail/router'

const router = Router()

router.use('/providers/gmail',gmailRouter)
router.post('/send',ControllerV1.sendEmail)
export default router