import { column, type Infer, sparq } from '@sgtzym/sparq'

import { auditColumns } from '~shared/lib/column.ts'

export const model = sparq('user', {
	...auditColumns(),
	name: column.text({ notNull: true, unique: true }),
	email: column.text({ notNull: true, unique: true }),
	password: column.text({ notNull: true }),
	alias: column.text(),
	lastSignin: column.date(),
})

export type User = Infer<typeof model>
export type PublicUser = Omit<User, 'password'>
