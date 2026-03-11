import { timingSafeEqual } from '@std/crypto'

/**
 * Hashes a password using PBKDF2-SHA256 with a random salt.
 *
 * @param raw - Plain-text password to hash.
 * @returns Base64-encoded salt + hash.
 */
export async function hashPassword(raw: string): Promise<string> {
	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(raw),
		'PBKDF2',
		false,
		['deriveBits'],
	)

	const salt = crypto.getRandomValues(new Uint8Array(16))
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
		keyMaterial,
		256,
	)

	const hashArray = new Uint8Array(bits)
	const combined = new Uint8Array(salt.length + hashArray.length)
	combined.set(salt)
	combined.set(hashArray, salt.length)

	return btoa(String.fromCharCode(...combined))
}

/**
 * Verifies a plain-text password against a stored PBKDF2 hash.
 *
 * @param raw - Plain-text password to verify.
 * @param stored - Value previously returned by {@link hashPassword}.
 * @returns `true` if the password matches, otherwise `false`.
 */
export async function verifyPassword(raw: string, stored: string): Promise<boolean> {
	const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0))
	const salt = combined.slice(0, 16)
	const storedHash = combined.slice(16)

	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(raw),
		'PBKDF2',
		false,
		['deriveBits'],
	)

	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
		keyMaterial,
		256,
	)

	return timingSafeEqual(storedHash, new Uint8Array(bits))
}
