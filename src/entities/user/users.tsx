import { Context, Hono } from '@hono/hono'
import { HTTPException } from '@hono/hono/http-exception'

import { repo as users, type User } from './user.ts'
import { type Insertable } from '~lib/column.ts'
import createApi from '~lib/create_api.ts'
import { hashPassword } from '~lib/crypto.ts'
import { strip } from '~lib/utils.ts'
import { render } from '~web/shared/render.tsx'
import { UserList } from '~entities/user/list.tsx'
import { UserListPage } from '~entities/user/page.tsx'

// ----------------------------------------------------------------------------
// API routes

// ----------------------------------------------------------------------------
// Web routes

export const web = new Hono()
	.get('/', (c: Context) => {
		return render(c, {
			page: () => <UserListPage users={list(c)} />,
			fragments: { '#users-list': () => <UserList users={list(c)} /> },
		})
	})
	.post('/', async (c: Context) => {
		const form = await c.req.formData()
		const name = form.get('name')?.toString()
		const email = form.get('email')?.toString()
		const password = form.get('password')?.toString()
		const alias = form.get('alias')?.toString()

		if (!name || !email || !password) throw new HTTPException(400)

		await create({ name, email, password, alias })

		return c.html(<UserList users={list(c)} />)
	})
