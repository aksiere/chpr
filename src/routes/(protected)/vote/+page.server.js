import { offset } from '$lib/utils/offset'
import { supabase } from '$lib/server/supabase'

const getDiff = (next, now) => (next.getTime() / 1000) - (now.getTime() / 1000)
const getNext = (n, x) => {
	let date = new Date(n.getTime())

	date.setDate(date.getDate() + (x + (7 - date.getDay())) % 7)
	date = setZero(date)

	return date
}

const setZero = (date) => {
	date.setHours(0)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)
	return date
}

const getDates = (now) => {
	let s1 = setZero(new Date(now.getTime()))
		s1.setDate((s1.getDate()) - ((s1.getDay() || 7) - 1))
	let e1 = setZero(new Date(now.getTime()))

	let s2 = setZero(new Date(now.getTime()))
		s2.setDate((s2.getDate()) - ((s2.getDay() || 7) - 1) + 7)
	let e2 = setZero(new Date(now.getTime()))
		e2.setDate((e2.getDate()) - ((e2.getDay() || 7) - 1) + 7 + (VOTE_DAY || 7) + 1)

	return {
		s1, e1, s2, e2
	}
}

const VOTE_DAY = 6

/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	const { session } = await parent()

	const now = new Date(Date.now() + offset)
	const next = getNext(now, VOTE_DAY)

	if (now.getDay() === VOTE_DAY) {
		const { s1, e1, s2, e2 } = getDates(now)
		// console.log(s1, e1, s2, e2);

		const { data: d1 } = await supabase.from('votes').select('*').is('like_id', null).eq('user_id', session.user.id).gt('timestamp', s2.getTime() / 1000).lt('timestamp', e2.getTime(e2) / 1000)
		let isvoted = d1.length > 0 ? true : false

		if (isvoted) {
			return {
				message: `(${d1.map(i => i.match_id).join(', ')})<br><br>Ваши голоса были учтены. Спасибо за участие.<br>Результаты можно будет посмотреть в ночь на воскресенье <a target='_blank' href='https://docs.google.com/spreadsheets/d/1knBYy6l8fhSDyVEm4e7Wos3RMyLnkWrywfn-LeDhpzQ/edit#gid=1431698609'>здесь</a>.`
			}
		} else {
			return {
				until: 0,
				liked_at: {
					start: s1,
					end: e1
				},
				timestamp: {
					start: s2,
					end: e2
				}
			}
		}
	} else {
		return {
			until: getDiff(next, now)
		}
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals: { getSession } }) => {
		const session = await getSession()
		const { chosen } = Object.fromEntries(await request.formData())

		if (!chosen) return

		let t2 = JSON.parse(chosen).map(e => ({
			user_id: session.user.id,
			match_id: e.match_id,
			timestamp: e.timestamp,
			points: 2,
		}))

		const now = new Date(Date.now() + offset)
		const { s1, e1, s2, e2 } = getDates(now)

		const { data: d1 } = await supabase.from('votes').select('*').is('like_id', null).eq('user_id', session.user.id).gt('timestamp', s2.getTime() / 1000).lt('timestamp', e2.getTime(e2) / 1000)
		let isvoted = d1.length > 0 ? true : false

		if (!isvoted) {
			const { data, error } = await supabase.from('votes').insert(t2)
		}

		return {
			success: true
		}
	}
}
