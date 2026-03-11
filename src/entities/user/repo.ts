import createRepo from '~shared/lib/create_repo.ts'

import { model, type User } from './model.ts'

export const repo = createRepo<User>(model)
