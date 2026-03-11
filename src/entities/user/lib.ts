import { ConflictError, InternalError, ValidationError } from '~core/middleware/error.ts'
import { type Insertable } from '~shared/lib/column.ts'
import { hashPassword } from '~shared/lib/crypto.ts'
import { strip } from '~shared/lib/utils.ts'

import { type PublicUser, type User } from './model.ts'
import { repo } from './repo.ts'

export const serialize = (user: User) => strip(['password'], user)

export const create = async (data: Insertable<User>) => {
	if (!data?.name || !data?.email || !data?.password) {
		throw new ValidationError('Name, email, and password are required.')
	}

	const existing = repo.findOne({ email: data.email })
	if (existing) throw new ConflictError('Email already in use.')

	const password = await hashPassword(data.password)
	const created = repo.create({ ...data, password })

	if (!created) throw new InternalError('Unable to create new user.')

	return serialize(created)
}

export const findMany = (query: Partial<User>): PublicUser[] => {
	const { name, email } = query

	return repo.findMany({
		...(name && { name }),
		...(email && { email }),
	}).map(serialize)
}
