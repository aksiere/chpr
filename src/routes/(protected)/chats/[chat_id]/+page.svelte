<script>
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { enhance } from '$app/forms'
	import { beforeUpdate, onDestroy, onMount } from 'svelte'
	import { afterUpdate, tick } from 'svelte'

	export let data
	$: ({ session, supabase, messages, activeChat } = data)

	let input

	const clearInput = () => input.value = ''
	const focusInput = () => input.focus()

	onMount(() => {
		supabase.channel('messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
			(payload) => {
				if (payload.new.author_id === session.user.id) return
				invalidateAll()
			},
		).subscribe()

		focusInput()
	})

	// auto scroll

	const scrollToBottom = async (node) => node.scroll({ top: node.scrollHeight, behavior: 'smooth' })

	afterUpdate(() => {
		if (messages) {
			console.log(1)
			scrollToBottom(document.querySelector('.wrapper'))
		}
	})

	// sending message

	const sendMessage = async (e) => {
		const form = new FormData(e.target)
		const { _, error } = await supabase.from('messages').insert([{ message: form.get('message'), chat_id: activeChat }])

		if (!error) {
			// invalidateAll()
			messages = [{ message: form.get('message'), author_id: session.user.id }, ...messages]
		}
	}
</script>

<section>
	<article class='wrapper'>
		<div class='messages d-flex column-reverse'>
			{#each messages as message (message)}
				<div class='message' class:outgoing={message.author_id === session.user.id}>
					{message.message}
				</div>
			{/each}
		</div>
	</article>

	<footer>
		<form on:submit|preventDefault={sendMessage} class='mt-3' method='post' use:enhance={() => {
			return () => {
				clearInput()
				focusInput()
			}
		}}>
			<input bind:this={input} type='text' name='message' autocomplete='off' placeholder='Написать сообщение..'>
		</form>
	</footer>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	article {
		flex: 1 1 auto;
		overflow-y: auto;
		min-height: 0px;
	}

	input {
		width: 100%;
	}

	.messages {
		& .message {
			width: clamp(200px, 50%, 400px);

			&.outgoing {
				text-align: right;
				margin-left: auto;
				width: clamp(200px, 50%, 400px);
			}
		}
	}
</style>
