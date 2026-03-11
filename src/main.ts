import cfg from '~core/config.ts'
import db from '~core/db.ts'

import { repo as users } from '~entities/user/repo.ts'
import { hashPassword } from '~shared/lib/crypto.ts'
import { env } from '~shared/lib/env.ts'

import { app } from './app.tsx'
import { InternalError } from '~core/middleware/error.ts'

// Add admin (super) user
if (!users.findOne({ active: true })) {
	const email = env('ADMIN_EMAIL', String)
	const raw = env('ADMIN_PASSWORD', String)

	if (!email || !raw) throw new InternalError('Admin credentials required.')

	const hashed = await hashPassword(raw)
	users.create({ name: 'admin', email, password: hashed })

	if (cfg.isDev) console.log(`Username: ${raw}\nPassword: ${raw}`)
}

const { hostname, port } = cfg

Deno.serve({ hostname, port }, app.fetch)

Deno.addSignalListener('SIGINT', () => {
	db.close()
	Deno.exit()
})
