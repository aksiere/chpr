import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ locals: { getSession }, url: { pathname } }) {
	const session = await getSession()
	if (!session) throw redirect(301, `/auth?rto=${pathname.slice(1)}`)
}
