import { fail, redirect } from '@sveltejs/kit'

export const load = async ({ locals: { getSession } }) => {
	const session = await getSession()
	if (session) throw redirect(303, '/')
}

export const actions = {
	signIn: async ({ request, url, locals: { supabase } }) => {
		const { provider, redirectTo } = Object.fromEntries(await request.formData())

		if (provider) {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${url.origin}/auth/callback?next=${redirectTo || '/'}`
				},
			})

			if (error) throw error

			/* Now authorize sign-in on browser. */
			if (data.url) throw redirect(303, data.url)

		} else {
			return fail(400, {
				error: 'Unknown error.',
				data: {
					email
				}
			})
		}
	},

	signOut: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut()
		throw redirect(303, '/')
	}
}