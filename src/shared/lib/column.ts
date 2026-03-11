import { column, type Infer, sparq } from '@sgtzym/sparq'

/** Returns standard audit columns for a Sparq schema. */
export function auditColumns() {
	return {
		id: column.text({ primaryKey: true, notNull: true }),
		createdAt: column.date({ notNull: true, default: 'CURRENT_TIMESTAMP' }),
		updatedAt: column.date({ notNull: true, default: 'CURRENT_TIMESTAMP' }),
		active: column.boolean({ notNull: true, default: true }),
	} as const
}

/** Sparq model and infer types for audit columns. */
const _auditModel = sparq('', auditColumns())
export type AuditColumn = Infer<typeof _auditModel>

/** Promotes properties whose type includes `undefined` to optional keys. */
type OptionalUndefined<T> =
	& { [K in keyof T as undefined extends T[K] ? K : never]?: T[K] }
	& { [K in keyof T as undefined extends T[K] ? never : K]: T[K] }

/** All non-audit fields required – optional if their type includes `undefined`. */
export type Insertable<T> = OptionalUndefined<Omit<T, keyof AuditColumn>>

/** All non-audit fields optional – for patch operations. */
export type Patchable<T> = Partial<Omit<T, keyof AuditColumn>>
