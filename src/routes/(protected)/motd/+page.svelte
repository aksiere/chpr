<script>
	import Loading from '$lib/components/Loading.svelte'

	export let data
	let { supabase, session, date } = data
</script>

<Loading cat={session.user.user_metadata.custom?.cat} />