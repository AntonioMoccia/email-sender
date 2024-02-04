import SMTPCoontroller from './controller'
import {Router} from 'express'


const router = Router()


router.get('/', SMTPCoontroller.base)

/**Login routes */
router.post('/login', SMTPCoontroller.login) 
router.patch('/update',SMTPCoontroller.update) 
router.delete('/delete',SMTPCoontroller.delete)
/**redirect */

export default router

/**
 * 
 * Router di un provider deve avere almeno due rotte
 * 
 */