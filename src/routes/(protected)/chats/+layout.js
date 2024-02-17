// export const csr = false

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent, params }) {
	const { supabase } = await parent()

	const getChats = async () => {
		let { data: chats } = await supabase.from('chats').select('*')
		return chats
	}

	return {
		chats: await getChats(),
		activeChat: params.chat_id
	}
}
