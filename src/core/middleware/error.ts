import type { ErrorHandler, NotFoundHandler } from '@hono/hono'
import { type ContentfulStatusCode } from '@hono/hono/utils/http-status'

import { ErrorPage } from '~shared/layout/page.tsx'

import cfg from '../config.ts'

// Custom Errors
export class ValidationError extends Error {
	readonly status = 400
}
export class UnauthorizedError extends Error {
	readonly status = 401
}
export class ForbiddenError extends Error {
	readonly status = 403
}
export class NotFoundError extends Error {
	readonly status = 404
}
export class ConflictError extends Error {
	readonly status = 409
}
export class UnprocessableError extends Error {
	readonly status = 422
}
export class InternalError extends Error {
	readonly status = 500
}

function parseError(err: unknown): {
	status: ContentfulStatusCode
	message: string
	stack?: string
} {
	const status = (
		err instanceof Error && 'status' in err ? (err as { status: number }).status : 500
	) as ContentfulStatusCode

	const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
	const stack = cfg.debug && err instanceof Error ? err.stack : undefined

	return { status, message, stack }
}

// Error 4xx / 5xx
export const handleError: ErrorHandler = (err, c) => {
	const { status, message, stack } = parseError(err)
	return c.req.header('Accept')?.includes('application/json')
		? c.json({ error: message, status, ...(stack && { stack }) }, status)
		: c.html(ErrorPage({ status, error: message }), status)
}

// Error 404: not found
export const handleNotFound: NotFoundHandler = (c) => {
	return c.req.header('Accept')?.includes('application/json')
		? c.json({ error: 'Not found.', status: 404 }, 404)
		: c.html(ErrorPage({ error: 'Not found.', status: 404 }), 404)
}
