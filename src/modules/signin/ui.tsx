import { Hono } from '@hono/hono'
import { deleteCookie, setCookie } from '@hono/hono/cookie'

import { sessionCookie } from './signin.ts'
import { repo as users } from '~entities/user/repo.ts'
import { verifyPassword } from '~shared/lib/crypto.ts'

import { SigninPage } from './page.tsx'

export const app = new Hono()
	.get('/signin', (c) => c.html(<SigninPage />))
	.post('/signin', async (c) => {
		const body = await c.req.parseBody()
		const email = String(body['email'] ?? '').trim()
		const password = String(body['password'] ?? '').trim()

		if (!email || !password) {
			return c.html(<SigninPage error='Bitte E-Mail und Passwort eingeben.' />, 400)
		}

		const user = users.findOne({ email })
		if (!user || !(await verifyPassword(password, user.password))) {
			return c.html(<SigninPage error='Ungültige Anmeldedaten.' />, 401)
		}

		setCookie(c, sessionCookie, String(user.id), {
			httpOnly: true,
			sameSite: 'Strict',
			path: '/',
		})

		return c.redirect('/')
	})
	.get('/signout', (c) => {
		deleteCookie(c, sessionCookie, { path: '/' })
		return c.redirect('/signin')
	})
