<script>
	import Input from '$lib/components/Input.svelte'
	import Button from '$lib/components/Button.svelte'
	import DimOnFocusWithin from '$lib/components/DimOnFocusWithin.svelte'

	export let data
	let { supabase, session } = data

	let input_nickname = session.user.user_metadata.custom?.nickname
	let input_description = session.user.user_metadata.custom?.description

	let session_nickname = input_nickname
	let session_description = input_description

	$: is_disabled = input_nickname === session_nickname && input_description === session_description

	let button_text = 'Сохранить'

	const updateUser = async () => {
		is_disabled = true
		button_text = 'Сохраняем...'

		await supabase.auth.updateUser({
			data: {
				custom: {
					nickname: input_nickname,
					description: input_description
				}
			}
		})

		session_nickname = input_nickname
		session_description = input_description
		button_text = 'Сохранить'
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

		<div class='mt-4'>
			<Button on:click={updateUser} disabled={is_disabled}>{button_text}</Button>
		</div>
	</DimOnFocusWithin>
</div>
