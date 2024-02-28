import { supabase } from '$lib/server/supabase'

const RARITY = {
	COMMON: 'common',
	UNCOMMON: 'uncommon',
	RARE: 'rare',
	EPIC: 'epic',
	LEGENDARY: 'legendary'
}

const GET_RANDOM_NUMBER = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const PRIZES = [
	{
		id: 'zil',
		title: 'ЗИЛ-130',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-car-suv" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 17a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M16 17a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M5 9l2 -4h7.438a2 2 0 0 1 1.94 1.515l.622 2.485h3a2 2 0 0 1 2 2v3" /><path d="M10 9v-4" /><path d="M2 7v4" /><path d="M22.001 14.001a4.992 4.992 0 0 0 -4.001 -2.001a4.992 4.992 0 0 0 -4 2h-3a4.998 4.998 0 0 0 -8.003 .003" /><path d="M5 12v-3h13" /></svg>',
		rarity: RARITY.LEGENDARY,
		from: 0,
		to: 1,
		amount: 1
	},
	{
		id: 'cs2',
		title: 'Скинчик в CS2',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-question" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M14.071 17.764a8.989 8.989 0 0 1 -2.071 .236c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.346 0 6.173 1.727 8.482 5.182" /><path d="M19 22v.01" /><path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" /></svg>',
		rarity: RARITY.LEGENDARY,
		from: 1,
		to: 5,
		amount: 1
	},
	{
		id: 'jackpot',
		title: 'Шекели',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pentagon-number-7" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13.163 2.168l8.021 5.828c.694 .504 .984 1.397 .719 2.212l-3.064 9.43a1.978 1.978 0 0 1 -1.881 1.367h-9.916a1.978 1.978 0 0 1 -1.881 -1.367l-3.064 -9.43a1.978 1.978 0 0 1 .719 -2.212l8.021 -5.828a1.978 1.978 0 0 1 2.326 0z" /><path d="M10 8h4l-2 8" /></svg>',
		rarity: RARITY.EPIC,
		from: 5,
		to: 15,
		amount: 1000
	},
	{
		id: 'superlikes',
		title: 'Суперлайки',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-heart-star" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.73 17.753l-5.23 -5.181a5 5 0 1 1 7.5 -6.566a5 5 0 0 1 8.563 5.041" /><path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" /></svg>',
		rarity: RARITY.EPIC,
		from: 15,
		to: 65,
		amount_may_be: {
			min: 2,
			max: 10
		}
	},
	{
		id: 'votes',
		title: 'Дополнительные голоса',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-speakerphone" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 8a3 3 0 0 1 0 6" /><path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" /><path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" /></svg>',
		rarity: RARITY.RARE,
		from: 65,
		to: 120,
		amount_may_be: {
			min: 2,
			max: 5
		}
	},
	{
		id: 'backs',
		title: 'Откаты',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-back" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" /></svg>',
		rarity: RARITY.RARE,
		from: 120,
		to: 170,
		amount_may_be: {
			min: 5,
			max: 15
		}
	},
	{
		id: 'coins',
		title: 'Шекели',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coins" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" /><path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" /><path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" /><path d="M3 6v10c0 .888 .772 1.45 2 2" /><path d="M3 11c0 .888 .772 1.45 2 2" /></svg>',
		rarity: RARITY.RARE,
		from: 170,
		to: 230,
		amount_may_be: {
			min: 10,
			max: 100
		}
	},
	{
		id: 'spins',
		title: 'Дополнительная крутка',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-poker-chip" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" /><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M18.364 5.636l-2.828 2.828" /><path d="M8.464 15.536l-2.828 2.828" /><path d="M5.636 5.636l2.828 2.828" /><path d="M15.536 15.536l2.828 2.828" /></svg>',
		rarity: RARITY.UNCOMMON,
		from: 230,
		to: 350,
		amount_may_be: {
			min: 1,
			max: 3
		}
	},
	{
		id: 'cat',
		title: 'Кот',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cat" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z" /><path d="M2 16h5l-4 4" /><path d="M22 16h-5l4 4" /><path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M9 11v.01" /><path d="M15 11v.01" /></svg>',
		rarity: RARITY.UNCOMMON,
		from: 350,
		to: 600,
		amount: 1
	},
	{
		id: 'nothing',
		title: 'Нихуя',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-space" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1 -1v-3" /></svg>',
		from: 600,
		to: 1000,
		rarity: RARITY.COMMON,
		amount_may_be: {
			min: 1,
			max: 10
		}
	}
]

const CHECK_PRIZE = (rand) => {
	let prize = PRIZES.filter(p => rand >= p.from && rand < p.to)[0]
	if (prize?.amount_may_be) {
		prize.amount = GET_RANDOM_NUMBER(prize.amount_may_be.min, prize.amount_may_be.max)
	}
	return prize
}

const GET_PRIZE = async () => {
	// const rand = GET_RANDOM_NUMBER(0, 1000)

	const { result } = await (await fetch('https://api.random.org/json-rpc/4/invoke', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'jsonrpc': '2.0',
			'method': 'generateIntegers',
			'params': {
				'apiKey': 'cb9127f2-7cb9-4c03-8393-5359762125f3',
				'n': 90,
				'min': 0,
				'max': 1000
			},
			'id': 1
		})
	})).json()

	const prize = CHECK_PRIZE(result.random.data[89])
	return CREATE_ITEMS(prize, result.random.data)
}

const CREATE_ITEMS = (realPrize, randomNumbers) => {
	let arr = new Array(90)

	for (let i = 0; i < arr.length; i++) {
		const prize = CHECK_PRIZE(randomNumbers[i])

		arr[i] = prize
		arr[80] = realPrize
	}

	return arr
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ locals: { getSession } }) => {
		const session = await getSession()

		let freeSpins = 0
		let assetSpins = 0
		
		// get free spins
		let { data: spins } = await supabase.from('spins').select('*').limit(1).order('created_at', { ascending: false }).eq('user_id', session.user.id)
		const timeTilLastFreeSpin = spins.length > 0 ? ((new Date().getTime() / 1000) - (new Date(spins[0]?.created_at).getTime() / 1000)) / 60 / 60 / 24 : 1
		freeSpins = timeTilLastFreeSpin < 1 ? 0 : 1

		// get asset spins
		let { data: assets } = await supabase.from('assets').select('*').eq('asset', 'spins').eq('user_id', session.user.id)
		assetSpins = assets.length > 0 ? assets.map(a => a.amount).reduce((a, b) => a + b) : 0

		if (freeSpins === 0 && assetSpins === 0) {
			const nextFreeSpin = new Date(spins[0]?.created_at)
			nextFreeSpin.setDate(nextFreeSpin.getDate() + 1)

			return {
				error: true,
				message: `У вас закончились крутки! Следующая бесплатная крутка: ${nextFreeSpin.getTime()}`
			}
		}

		const items = await GET_PRIZE()
		const prize = items[80]

		let add_spins = 0
		console.log(prize)

		switch (prize.id) {
			case 'jackpot':
				await supabase.from('assets').insert([
					{ user_id: session.user.id, asset: 'coins', amount: prize.amount },
				])
				break
			case 'superlikes':
				await supabase.from('assets').insert([
					{ user_id: session.user.id, asset: 'superlikes', amount: prize.amount },
				])
				break
			case 'votes':
				await supabase.from('assets').insert([
					{ user_id: session.user.id, asset: 'votes', amount: prize.amount },
				])
				break
			case 'backs':
				await supabase.from('assets').insert([
					{ user_id: session.user.id, asset: 'backs', amount: prize.amount },
				])
				break
			case 'coins':
				await supabase.from('assets').insert([
					{ user_id: session.user.id, asset: 'coins', amount: prize.amount },
				])
				break
			case 'spins':
				add_spins = prize.amount
				await supabase.from('assets').insert([
					{ user_id: session.user.id, asset: 'spins', amount: prize.amount },
				])
				break
			case 'cat':
				const res = await (await fetch('https://api.thecatapi.com/v1/images/search?api_key=live_3ntmgVSmRY5ZBIIPli0r4UlLUrPZlgcHr2CTk6aC1uy7pWXp6dhUTX6wD471c6Mg')).json()
				await supabase.from('cats').insert([
					{ user_id: session.user.id, url: res[0].url },
				])
				break
			default:
				break
		}

		await supabase.from('spins').insert([
			{ user_id: session.user.id, prize: `${prize.title} (x${prize.amount})` },
		])

		if (freeSpins === 0 && assetSpins > 0) {
			await supabase.rpc('decrease_latest_asset_amount', { asset_: 'spins', user_id_: session.user.id })
		}

		return {
			items,
			offset: GET_RANDOM_NUMBER(2, 98),
			add_spins
		}
	}
}
