import { Context } from '@hono/hono'

import { Insertable } from '~shared/lib/column.ts'
import createApi from '~shared/lib/create_api.ts'

import { create, findMany, serialize } from './lib.ts'
import { type User } from './model.ts'
import { repo } from './repo.ts'

export const app = createApi(repo, { serialize })
	.get('/', (c: Context) => c.json(findMany(c.req.query()), 200))
	.post('/', async (c: Context) => {
		const data = await c.req.json<Insertable<User>>()
		return c.json(await create(data), 201)
	})
