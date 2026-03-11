import { Context, Next } from '@hono/hono'
import { getCookie } from '@hono/hono/cookie'

import { repo as users } from '~entities/user/repo.ts'
import { UnauthorizedError } from '~core/middleware/error.ts'
import { verifyPassword } from '~shared/lib/crypto.ts'

// ----------------------------------------------------------------------------
// Basic Authentication

export const requireAuth = async (c: Context, next: Next) => {
	const header = c.req.header('Authorization')
	if (!header?.startsWith('Basic ')) throw new UnauthorizedError()

	const [email, password] = atob(header.slice(6)).split(':')

	const user = users.findOne({ email })
	if (!user || !(await verifyPassword(password, user.password))) throw new UnauthorizedError()

	c.set('user', user)
	await next()
}

// ----------------------------------------------------------------------------
// Basic Authentication + Session Cookie

export const sessionCookie = 'session'

export const requireSession = async (c: Context, next: Next) => {
	const id = getCookie(c, sessionCookie)
	if (!id) return c.redirect('/signin')

	const user = users.findOne({ id })
	if (!user) return c.redirect('/signin')

	c.set('user', user)
	await next()
}
