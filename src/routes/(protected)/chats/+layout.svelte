<script>
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

	import Loading from '$lib/components/Loading.svelte'

	export let data
	let { session, chats } = data
	$: ({ activeChat } = data)

	let names = [], avatars = [], nicknames = []

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

{#if names.length > 0}
	<div class='box 100h'>
		<div class='flex 100h'>
			<div class='1/1 md:1/3 px-3 md:px-0 py-3 100h' style='position: relative; overflow-y: auto;' class:d-none={activeChat !== undefined} class:md:d-block={activeChat !== undefined}>
				<ul>
					{#each chats as { id, users }, i (id)}
						<a href='/chats/{id}'>{nicknames[i]}</a>
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

<style>

</style>
