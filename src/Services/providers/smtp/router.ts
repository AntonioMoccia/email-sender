import GmailController from '@Services/providers/gmail/controller'
import {Router} from 'express'

const gmailController = new GmailController()
const router = Router()

router.get('/', gmailController.hello)
/**Sand email with provider authenticated */
router.post('/sand-email', gmailController.sandEmail)

/**Login routes */
router.get('/login', gmailController.login) // to create service credentials
router.get('/update', gmailController.login) //to update service credentials

/**Redirect google login */

/*/providers/gmail/login/google/oauth
*/

router.get('/login/google/oauth', gmailController.redirect)

export default router

/**
 * 
 * Router di un provider deve avere almeno due rotte
 * 
 */