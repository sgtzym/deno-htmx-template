import { model as user } from '~entities/user/model.ts'
import createDatabase from '~shared/lib/create_db.ts'
import { ensureDir } from '~shared/lib/utils.ts'

import cfg from './config.ts'

if (!cfg.isTest) await ensureDir(cfg.path.db)

export const db = createDatabase(cfg.isTest ? ':memory:' : cfg.path.db, {
	busy_timeout: 5000,
	foreign_keys: 'on',
	journal_mode: 'wal',
	synchronous: 'normal',
})

db.init([user])

export default db
