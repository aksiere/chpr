/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
	await parent()
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: () => {
		return
	}
}
