<script>
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'

	import Button from '$lib/components/Button.svelte'

	let origin = $page.url.origin
	let params = new URLSearchParams($page.url.search)
	let redirectTo = params.get('rto')

	let form
</script>

<div class='100h'>
	<form method='post' action='{origin}/auth?/signIn' bind:this={form} use:enhance>
		<input type='hidden' name='redirectTo' value={redirectTo}>
		<input type='hidden' name='provider' value='discord'>
		<Button fluid marquee duration={5} type='submit'>авторизоваться через дискорд</Button>
	</form>
</div>

<style>
	div {
		display: grid;
		place-items: center;
	}
</style>
