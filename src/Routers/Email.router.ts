import EmailController from '@Controllers/Email.controller'
import { Router } from 'express'

export const basePath = '/'
export const router = Router()

router.post('/sand/:service/sand-email', EmailController.sandEmail)
router.get('/sand/login', EmailController.login)
router.get('/sand/login/google/oauth', EmailController.saveLogin)

export default router

/**
 *         const redirectUrl = 'http://127.0.0.1:5000/oauth'
        const oAuth2Client = new OAuth2Client(
            "894941328687-mjg4kn5ggiljposa8ngevljt3nnck21r.apps.googleusercontent.com",
            "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",
            redirectUrl
        )

        if (code) {
            const resTokens = await oAuth2Client.getToken(code)
            oAuth2Client.setCredentials({
                refresh_token: resTokens.tokens.refresh_token,
                access_token: resTokens.tokens.access_token
            })

        }

 */