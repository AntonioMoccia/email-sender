import GmailController from './controller'
import {Router} from 'express'

const gmailController = new GmailController()
const router = Router()

router.get('/', gmailController.base)
/**Sand email with provider authenticated */
router.post('/sand-email', gmailController.sendEmail)
/**Login routes */
router.get('/login', gmailController.login) 
router.post('/update',gmailController.update) 
router.delete('/delete',gmailController.delete)

/**redirect */
router.get('/google/oauth', gmailController.redirect)

export default router

/**
 * 
 * Router di un provider deve avere almeno due rotte
 * 
 */