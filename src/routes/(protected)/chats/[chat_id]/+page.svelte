<script>
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { enhance } from '$app/forms'
	import { beforeUpdate, onDestroy, onMount } from 'svelte'
	import { afterUpdate, tick } from 'svelte'

	import Input from '$lib/components/Input.svelte'
	import DimOnFocusWithin from '$lib/components/DimOnFocusWithin.svelte'

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
			<Input fluid bind:_this={input} type='text' name='message' autocomplete='off' placeholder='Написать сообщение..' />
		</form>
	</footer>
</section>

<style>
	@keyframes detect-scroll {
		from, to { --can-scroll: ; }
	}

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

	.wrapper {
		/* -webkit-mask: linear-gradient(0deg, #0000, #000 10% 80%, #0000); */
		animation: detect-scroll linear;
		animation-timeline: scroll(self);

		--if-can-scroll: var(--can-scroll) 1rem;
		--if-cant-scroll: 0;
		padding-right: var(--if-can-scroll, var(--if-cant-scroll));

		&::-webkit-scrollbar-thumb {
			background-color: var(--palette-2);
			border-radius: 4px;
		}

		&::-webkit-scrollbar {
			width: 10px;
		}
		
		&::-webkit-scrollbar-track {
			background-color: var(--palette-1);
		}
	}

	.messages {
		gap: .25rem;

		& .message {
			display: inline-block;
			width: fit-content;
			padding: 0.5em 1em;

			background-color: var(--palette-3);
			border-radius: calc(var(--border-radius) * 1.5);
			border-bottom-left-radius: calc(var(--border-radius) / 2);

			&.outgoing {
				text-align: right;
				margin-left: auto;

				background-color: var(--primary);
				border-radius: calc(var(--border-radius) * 1.5);
				border-bottom-right-radius: calc(var(--border-radius) / 2);
			}
		}
	}
</style>
