import GmailController from '@Services/providers/gmail/controller'
import {Router} from 'express'

const gmailController = new GmailController()
const router = Router()



router.post('/',(req,res)=>{
    res.redirect(`${req.baseUrl}/prova`)
})
router.get('/prova',(req,res)=>{
    res.json({
        msg:'from redirect'
    })
})


router.get('/', gmailController.hello)
/**Sand email with provider authenticated */
router.post('/sand-email', gmailController.sandEmail)
/**Login routes */
/* router.post('/login', gmailController.login) */ // to create service credentials or create provider

router.post('/update',(req,res)=>{
    const id_service = req.query.id_service
    res.redirect(`${req.baseUrl}/update?id_service=${id_service}`)
})

router.get('/connect',gmailController.connect)

router.get('/update', gmailController.update) //to update service credentials

/**Redirect google login */

/*/providers/gmail/login/google/oauth
*/
//redirect
router.get('/login/google/oauth', gmailController.redirect)

export default router

/**
 * 
 * Router di un provider deve avere almeno due rotte
 * 
 */