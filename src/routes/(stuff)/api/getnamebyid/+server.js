import { adminAuthClient } from '$lib/server/supabase'
import { json } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const url = new URL(request.url)
	const params = new URLSearchParams(url.search)
	const id = params.get('id')

	const { data: { user: { user_metadata } } } = await adminAuthClient.getUserById(id.toString())
	
	return json({
		nickname: user_metadata.custom?.nickname,
		name: user_metadata.full_name,
		avatar: user_metadata.avatar_url
	})
}
