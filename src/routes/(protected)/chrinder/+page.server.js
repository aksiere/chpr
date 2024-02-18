import { offset } from '$lib/utils/offset'
import { supabase } from '$lib/server/supabase'

/** @type {import('./$types').PageLoad} */
export async function load({ parent, getClientAddress }) {
	await parent()

	// supabase.channel('channel-chrinder').on('postgres_changes', { event: '*', schema: 'public', table: 'likes' },
	// 	(payload) => {
	// 		console.log('trigger 1')
			
	// 		supabase.channel('room1').subscribe((status) => {
	// 			console.log(status);
	// 			if (status === 'SUBSCRIBED') {
	// 				supabase.channel('room1').send({
	// 					type: 'broadcast',
	// 					event: 'test',
	// 					payload: { data: 'testdata' },
	// 				})
	// 			}
	// 		})
	// 	}
	// ).subscribe()

	const ip = getClientAddress() === '127.0.0.1' ? '146.120.72.179' : getClientAddress() 
	const geo = await(await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`)).json()
	// const date = await(await fetch('https://chronosproject.ru/api/nextweekfast')).json()

	const date = new Date(Date.now() + offset)

	const date1 = new Date(Date.now() + offset)
	date1.setDate(date1.getDate() - (date1.getDay() + 6) % 7)
	date1.setHours(0)
	date1.setMinutes(0)
	date1.setSeconds(0)
	date1.setDate(date1.getDate() + ((date.getDay() || 7) < 6 ? 7 : 14))

	return {
		date: date1.getFullYear() + '-' + (date1.getMonth() + 1).toString().padStart(2, '0') + '-' + date1.getDate().toString().padStart(2, '0'),
		ip,
		geo
	}
}
