import { Context, Next } from '@hono/hono'
import { getCookie } from '@hono/hono/cookie'

import { repo as users } from '~entities/user/repo.ts'

export const auth = async () => {}

export const sessionCookie = 'session'

export const session = async (c: Context, next: Next) => {
	const id = getCookie(c, sessionCookie)
	if (!id) return c.redirect('/signin')

	const user = users.findOne({ id })
	if (!user) return c.redirect('/signin')

	c.set('user', user)
	await next()
}
