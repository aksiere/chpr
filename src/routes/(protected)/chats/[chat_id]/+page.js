/** @type {import('./$types').PageLoad} */
export async function load({ parent, params }) {
	const { supabase } = await parent()

	const getMessages = async () => {
		let { data: messages, error } = await supabase.from('messages').select('message, author_id').eq('chat_id', params.chat_id).order('created_at', { ascending: false })
		return messages
	}

	return {
		messages: await getMessages()
	}
}
