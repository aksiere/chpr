/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { supabase } = await parent()

	let { data: cats } = await supabase.from('cats').select('*')

	return {
		cats
	}
}