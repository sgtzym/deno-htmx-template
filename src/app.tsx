import { Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'

import cfg from '~core/config.ts'
import { handleError, handleNotFound } from '~core/middleware/error.ts'
import { log } from '~core/middleware/log.ts'
import { app as userApi } from '~entities/user/api.ts'
import { requireAuth, requireSession } from '~modules/signin/auth.ts'
import { app as signinUi } from '~modules/signin/ui.tsx'
import { render } from '~shared/lib/render.tsx'

export const api = new Hono()
	.use('*', log)
	.use(requireAuth)
	.route('/users', userApi)

export const ui = new Hono()
	.route('/', signinUi)
	.use(requireSession)
	.get('/', (c) => render(c, { page: () => <div>test</div> }))

export const app = new Hono()
	.use(`/public/*`, serveStatic({ root: './' }))
	.route(cfg.path.api, api)
	.route('/', ui)
	.onError(handleError)
	.notFound(handleNotFound)
