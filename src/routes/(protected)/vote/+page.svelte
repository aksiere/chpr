<script>
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { onDestroy, onMount } from 'svelte'
	import { page } from '$app/stores'

	import Loading from '$lib/components/Loading.svelte'
	import Switch from '$lib/components/Switch.svelte'
	import Button from '$lib/components/Button.svelte'

	export let data
	let { supabase, until, liked_at, timestamp, message } = data

	$: seconds = Math.floor(until % 60)
	$: minutes = Math.floor((until / 60) % 60)
	$: hours = Math.floor((until / 60 / 60) % 24)
	$: days = Math.floor((until / 60 / 60 / 24) % 7)

	let worker

	if (browser) {
		if (until) {
			const workerURL = new URL(
				'../../../lib/workers/interval.js',
				import.meta.url,
			).href
			
			worker = new Worker(workerURL)
			worker.onmessage = function () {
				until--

				if (until === 1) {
					waiting = true
				}

				if (until === 0) {
					invalidateAll()
					return
				}
			}
		}
	}

	let audio

	onMount(() => {
		audio = new Audio(`${$page.url.origin}/vote.wav`)
		audio.play()
		audio.addEventListener('timeupdate', function(e) {
			if (this.currentTime > 6.75) {
				this.currentTime = 3.126
				this.play()
			}
		}, false)
	})

	onDestroy(() => {
		worker?.terminate()
		audio?.pause()
	})

	const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
	let candidates = []
	let timestamps = {}
	let translations = {}

	const getCandidates = async (votes) => {
		const { data } = await supabase.from('votes').select('*').gt('timestamp', timestamp.start.getTime() / 1000).lt('timestamp', timestamp.end.getTime() / 1000)
		
		data.map((f) => {
			candidates.push(+f.match_id)
			timestamps[+f.match_id] = +f.timestamp
		})

		candidates = [...new Set(candidates)]
	}

	const getFixture = async (match_id) => {
		const { data } = await supabase.from('fixtures').select('*').eq('fixture_id', match_id)
		return data[0]
	}

	let show_translation = false

	const getTranslation = async (logo) => {
		const t1 = logo.split('/')
		const t2 = +t1.at(-1).split('.').at(0)
		const { data } = await supabase.from('translations').select('translation_adl').eq('team_id', t2)
		translations[logo] = data[0].translation_adl.charAt(0).toUpperCase() + data[0].translation_adl.slice(1)
	}

	const pad = (text, amount = 2, placeholder = '0') => {
		text = isNaN(text) ? text : text.toString()
		return text.padStart(amount, placeholder)
	}

	let chosen = []
	let max_chosen = 5
	let _chosen = ''

	let loading = false

	const add = (fixture) => {
		const id = fixture.response.fixture.id
		const timestamp = fixture.response.fixture.timestamp

		if (!chosen.find(f => f.match_id === id)) {
			if (chosen.length < max_chosen) {
				chosen = [...chosen, { match_id: id, timestamp: timestamp }]
			}
		} else {
			chosen = chosen.filter(f => f.match_id !== id)
		}

		_chosen = JSON.stringify(chosen)
	}
</script>

{#if message}
	<div class='d-grid place-center 100h' style='text-align: center;'>
		<p class='muted'>{@html message}</p>
	</div>
{:else}
	{#if until}
		<div class='d-grid place-center 100h'>
			<p class='muted'>{pad(days)} : {pad(hours)} : {pad(minutes)} : {pad(seconds)}</p>
		</div>
	{:else}
		<div class='box 100h'>
			{#await getCandidates()}
				<div class='d-grid place-center 100h'>
					<Loading />
				</div>
			{:then}
				<div class='flex p-3'>
					{#each candidates as candidate, i}
						{#await getFixture(candidate)}
							<div class='card 1/1 md:1/2 d-flex align-center justify-center'>
								{candidate}
							</div>
						{:then fixture}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							{#if fixture}
								{#await getTranslation(fixture.response.teams.home.logo)}{/await}
								{#await getTranslation(fixture.response.teams.away.logo)}{/await}

								<div
									class='card 1/1 md:1/2 d-flex align-center justify-center'
									class:inactive={chosen.length >= max_chosen && !chosen.find(f => f.match_id === fixture.response.fixture.id)}
									class:active={chosen.find(f => f.match_id === fixture.response.fixture.id)}
									on:click={() => add(fixture)}
								>
									{#if show_translation}
										{translations[fixture.response.teams.home.logo]} <img class='mx-2' loading='eager' src={fixture.response.teams.home.logo} height='16' alt=''> 
										— 
										<img class='mx-2' loading='eager' src={fixture.response.teams.away.logo} height='16' alt=''> {translations[fixture.response.teams.away.logo]}
									{:else}
										{fixture.response.teams.home.name} <img class='mx-2' loading='eager' src={fixture.response.teams.home.logo} height='16' alt=''> 
										— 
										<img class='mx-2' loading='eager' src={fixture.response.teams.away.logo} height='16' alt=''> {fixture.response.teams.away.name}
									{/if}
								</div>
							{/if}
						{/await}
					{/each}
				</div>

				<div class='1/1 p-3 d-flex b0 md:b1 mt-3 cat' style='position: sticky; background: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url({$page.url.origin}/vote_bg_output.gif); background-repeat: no-repeat; background-size: cover; background-position: 50% 50%; border-radius: var(--border-radius);'>
					<div class='d-flex align-center'>
						<Switch id='show_translation' bind:checked={show_translation} />
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class='ml-3'>Перевод</label>
					</div>
					<div class='d-flex align-center ml-a'>
						{chosen.length}&nbsp;<span class='muted'>/ {max_chosen}</span>
						<form method='post' on:submit={() => loading = true}>
							<input type='hidden' name='chosen' bind:value={_chosen}>
							<Button disabled={chosen.length === 0 || loading} marquee class='ml-3'>Проголосовать</Button>
						</form>
					</div>
				</div>
			{/await}
		</div>
	{/if}
{/if}

<style>
	.card {
		border: 2px solid var(--palette-2);
		border-radius: var(--border-radius);
		padding: 1rem;
		cursor: pointer;

		&:hover {
			background: var(--palette-2);
		}

		&.active {
			border-color: var(--primary);
		}
	}
</style>
