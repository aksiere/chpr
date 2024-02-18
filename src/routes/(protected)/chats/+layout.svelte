<script>
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

	import Loading from '$lib/components/Loading.svelte'

	export let data
	let { session, chats } = data
	$: ({ activeChat } = data)

	let names = [], avatars = [], nicknames = []
	// $: console.log(names)

	if (browser) {
		let promises = []

		for (const chat of chats) {
			const id = chat.users.filter(i => i !== session.user.id)[0]
			promises.push(fetch(`${$page.url.origin}/api/getnamebyid?id=${id}`, { method: 'post' }))
		}

		Promise.all(promises).then(async (users) => {
			for (const user of users) {
				const u = (await user.json())
				names = [...names, u.name]
				nicknames = [...nicknames, u.nickname || '']
				avatars = [...avatars, u.avatar || '']
			}
		})
	}
</script>

{#if chats.length > 0}
	{#if names.length > 0}
		<div class='box 100h'>
			<div class='flex 100h'>
				<div class='1/1 md:1/3 px-3 md:px-0 py-3 100h' style='position: relative; overflow-y: auto;' class:d-none={activeChat !== undefined} class:md:d-block={activeChat !== undefined}>
					<ul>
						{#each chats as { id, users }, i (id)}
							<li class='mt-3'>
								<a href='/chats/{id}' class:active={activeChat === id}>
									{#if avatars[i]}
										<img src={avatars[i]} alt={names[i]}>
									{/if}

									{#if nicknames[i]}
										<span>
											{nicknames[i]} <span class='muted'>#{names[i]}</span>
										</span>
									{:else}
										<span>#{names[i]}</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
				<div class='1/1 md:2/3 px-3 md:px-0 py-3 100h' class:d-none={activeChat === undefined} class:md:d-block={activeChat === undefined}>
					<slot />
				</div>
			</div>
		</div>
	{:else}
		<div class='d-grid place-center 100h'>
			<!-- <p class='muted'>Подгружаю чаты...</p> -->
			<Loading />
		</div>
	{/if}
{:else}
	<div class='d-grid place-center 100h'>
		<p class='muted'>Чатов нема. Попробуй лайки там поставить, не знаю...</p>
	</div>
{/if}

<style>
ul {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;

		& li {
			width: 100%;

			& a {
				display: flex;
				align-items: center;
				padding: 1rem 1.25rem;
				color: var(--palette-7);
				width: 100%;
				background: none;
				border: 1px solid var(--palette-2);
				border-radius: var(--border-radius);
				transition: all var(--transition);

				&:hover {
					color: var(--palette-8);
					background: var(--palette-2);
				}

				&.active {
					background: var(--palette-2);
					border-color: var(--palette-3);
					color: var(--palette-9);
				}

				& img {
					height: 32px;
					line-height: 0;
					margin-right: .75rem;
					border-radius: var(--border-radius-rounded);
				}
			}
		}
	}
</style>
