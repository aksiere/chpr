/** @type {import('./$types').PageLoad} */
export async function load({ parent, data }) {
	const { supabase } = await parent()

	let availableSpins = 0

	// get free spins
	let { data: spins } = await supabase.from('spins').select('*').limit(1)
	const timeTilLastFreeSpin = spins.length > 0 ? ((new Date().getTime() / 1000) - (new Date(spins[0]?.created_at).getTime() / 1000)) / 60 / 60 / 24 : 1
	availableSpins += timeTilLastFreeSpin < 1 ? 0 : 1

	// get asset spins
	let { data: assets } = await supabase.from('assets').select('*').eq('asset', 'spins')
	availableSpins += assets.length > 0 ? assets.map(a => a.amount).reduce((a, b) => a + b) : 0

	return {
		availableSpins,
		...data
	}
}
