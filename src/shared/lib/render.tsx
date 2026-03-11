import { type Context } from '@hono/hono'
import { type FC } from '@hono/hono/jsx'

import { Page } from '../layout/page.tsx'

/**
 * Renders a page or fragment based on the request type.
 *
 * - Default: wraps `page` incl. html-shell.
 * - HTMX request: returns the `page` content only.
 * - HTMX request with a matching `HX-Target`: returns the matching fragment only.
 *
 * @param c - The Hono request context.
 * @param targets - The page component and optional named fragments keyed by `#id`.
 */
export function render(c: Context, targets: {
	page: FC
	fragments?: Record<string, FC>
}) {
	const isHtmx = !!c.req.header('HX-Request')
	const rawTarget = c.req.header('HX-Target')
	const key = rawTarget ? `#${rawTarget}` : undefined

	if (isHtmx && key && targets.fragments?.[key]) {
		const Fragment = targets.fragments[key]
		return c.html(<Fragment />)
	}

	const Content = targets.page

	return c.html(
		isHtmx ? <Content /> : (
			<Page>
				<Content />
			</Page>
		),
	)
}
