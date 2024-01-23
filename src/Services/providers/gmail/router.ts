import GmailController from '@Services/providers/gmail/controller'
import {Router} from 'express'

const gmailController = new GmailController()
const router = Router()

router.get('/', gmailController.hello)
/**Sand email with provider authenticated */
router.post('/sand/:service/sand-email', gmailController.sandEmail)

/**Login routes */
router.get('/sand/login', gmailController.login) // to create service credentials
router.get('/sand/:id_service/login', gmailController.login) //to update service credentials

/**Redirect google login */
router.get('/sand/login/google/oauth', gmailController.redirect)

export default router