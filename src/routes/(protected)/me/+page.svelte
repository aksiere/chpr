<script>
	import Input from '$lib/components/Input.svelte'
	import Button from '$lib/components/Button.svelte'
	import DimOnFocusWithin from '$lib/components/DimOnFocusWithin.svelte'
	import { invalidateAll } from '$app/navigation'

	export let data
	let { supabase, session, cats } = data

	let input_nickname = session.user.user_metadata.custom?.nickname
	let input_description = session.user.user_metadata.custom?.description
	let input_current_cat = session.user.user_metadata.custom?.cat

	let session_nickname = input_nickname
	let session_description = input_description
	let session_current_cat = input_current_cat

	$: is_disabled = input_nickname === session_nickname && input_description === session_description && input_current_cat === session_current_cat

	let button_text = 'Сохранить'

	const updateUser = async () => {
		is_disabled = true
		button_text = 'Сохраняем...'

		await supabase.auth.updateUser({
			data: {
				custom: {
					nickname: input_nickname,
					description: input_description,
					cat: input_current_cat
				}
			}
		})

		session_nickname = input_nickname
		session_description = input_description
		session_current_cat = input_current_cat
		button_text = 'Сохранить'
		invalidateAll()
	}
</script>

<div class='box p-3'>
	<DimOnFocusWithin>
		<div style='width: 100px; aspect-ratio: 1/1; background: url({session?.user.user_metadata.avatar_url}), var(--palette-2); background-size: cover; border-radius: 50%;'></div>

		<div class='mt-4'>
			<Input fluid type='text' label='Отображаемое имя' bind:value={input_nickname} />
		</div>

		<div class='mt-3'>
			<Input fluid type='text' label='Описание' bind:value={input_description} />
		</div>

		<div class='mt-3'>
			<Input fluid type='hidden' label='Коты' />
		</div>

		<div class="flex g-3">
			{#each cats as cat}
				<img src={cat.url} alt={cat.url} class:active={input_current_cat === cat.url} on:click={() => input_current_cat = cat.url} height='100'>
			{/each}
		</div>
		
		<div class='mt-4'>
			<Button on:click={updateUser} disabled={is_disabled}>{button_text}</Button>
		</div>
	</DimOnFocusWithin>
</div>

<style>
	img {
		border-radius: var(--border-radius);
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	img.active {
		outline: 2px solid var(--primary);
	}
</style>
