<script>
	import { onMount } from 'svelte'
	import { fly, fade, blur } from 'svelte/transition'
	import Switch from '$lib/components/Switch.svelte'
	import Loading from '$lib/components/Loading.svelte'
	import gsap from 'gsap'
	import { page } from '$app/stores'

	import { PUBLIC_API_URL } from '$env/static/public'

	import { countries_translation } from '$lib/utils/countries'
	import { browser } from '$app/environment'

	const DEBUG = false

	export let data
	let { supabase, session, date } = data

	$: client_width = 0
	// $inspect(client_width)

	if (browser) {
		client_width = window.innerWidth
	}

	let ITSAMATCH = false
	const duration = 4
	
	function test1(node) {
		let tl = gsap.timeline()
		const ease = 'power3.out'
		const xPercent = 600
		
		tl.from(node, {
			duration,
			onStart: () => {
				let audio = new Audio(`${$page.url.origin}/max.wav`)
					audio.play()
			},
		})
		.from('.words > span:nth-child(2) > div:nth-child(1)', {
			xPercent,
			ease,
		}, `-=${duration * 1}`)
		.from('.words > span:nth-child(2) > div:nth-child(2)', {
			xPercent,
			ease,
		}, `-=${duration * 0.95}`)
		.from('.words > span:nth-child(2) > div:nth-child(3)', {
			xPercent,
			ease,
		}, `-=${duration * 0.90}`)
		.from('.words > span:nth-child(2) > div:nth-child(4)', {
			xPercent,
			ease,
		}, `-=${duration * 0.85}`)
		.from('.words > span:nth-child(2) > div:nth-child(5)', {
			xPercent,
			ease,
		}, `-=${duration * 0.80}`)
		.from('.words > span:nth-child(2) > div:nth-child(6)', {
			xPercent,
			ease,
		}, `-=${duration * 0.75}`)
		.to(node, {
			opacity: 0,
			onComplete: () => {
				ITSAMATCH = false
				// audio.pause()
			},
		}, duration)

		return {
			/* GSAP's duration is in seconds. Svelte's is in miliseconds */
			duration: duration * 1000,
			tick: t => {
				tl.progress(t);
			}
		}
	}

	const recalculate = () => {
		client_width = window.innerWidth
	}

	$: current_date = date

	$: country = 'All'
	$: countries = []

	$: fetching = true

	$: likes = []
	// $inspect(likes).with(console.log)

	const getLikes = async () => {
		let { data } = await supabase.from('likes').select('*').eq('user_id', session.user.id)
		likes = data.map(l => +l.match_id)
	}

	$: fixtures = []
	let fetched_fixtures = []
	// $inspect(fetched_fixtures).with(console.log)

	const getFixtures = async () => {
		// let { data: _fixtures } = await supabase.from('fixtures').select('response').like('date', `%${date}%`)
		let _fixtures = await(await fetch(`${PUBLIC_API_URL}/api/fixtures/${current_date}`)).json()

		fixtures = _fixtures.filter(f => !likes.includes(f.response.fixture.id)).map((f, i) => {
			return {
				response: {
					fixture: {
						id: f.response.fixture.id,
						timestamp: f.response.fixture.timestamp,
						venue: {
							city: f.response.fixture.venue.city
						}
					},
					league: {
						country: f.response.league.country
					},
					teams: {
						home: {
							name: f.response.teams.home.name,
							logo: f.response.teams.home.logo,
						},
						away: {
							name: f.response.teams.away.name,
							logo: f.response.teams.away.logo,
						}
					}
				},
				visible: [0, 1, 2].includes(i) ? true : false
			}
		})
		fetched_fixtures = fixtures

		countries = [...new Set(fixtures.map(f => f.response.league.country))].sort((a, b) => {
			const nameA = countries_translation[a]
			const nameB = countries_translation[b]
			if (nameA < nameB) {
				return -1
			}
			if (nameA > nameB) {
				return 1
			}

			return 0
		})
		country = 'All'
	}

	const doFilter = async () => {
		fixtures = [...fetched_fixtures].filter(f => country === 'All' ? f.response.league.country : f.response.league.country === country).map((f, i) => {
			return {
				...f,
				visible: [0, 1, 2].includes(i) ? true : false
			}
		})
	}

	onMount(async () => {
		await getLikes()
		await getFixtures()
		fetching = false

		client_width = window.innerWidth

		supabase.channel('room1').subscribe((status) => {
			// console.log(status)
		}).on('broadcast', { event: 'test' }, async ({ payload: { data: { user_id, match_id, action } } }) => {
			if (user_id === session.user.id) return
			if (action !== 'like') return

			if (likes.includes(match_id)) {
				gsap.killTweensOf('.words')
				ITSAMATCH = true
			}
  		})
	})

	const onChange = async (param) => {
		switch (param) {
			case 'date':
				fetching = true
				await getFixtures()
				fetching = false
				break
			case 'country':
				await doFilter()
				break
			default:
				break
		}
	}

	// 

	$: trigger_at = client_width / 4
	// $inspect(trigger_at)

	$: target_id = undefined
	$: target_in = undefined
	$: pointed_x = undefined

	// $inspect(target_id, target_in, pointed_x).with(console.log)

	const broadcast = (data) => {
		supabase.channel('room1').send({
			type: 'broadcast',
			event: 'test',
			payload: { data },
		})
	}

	const onpointerdown = (e, index) => {
		target_id = +e.target.id
		pointed_x = e.pageX

		if (index !== undefined) {
			target_in = index
		}

		if (document.getElementById(target_id)) {
			document.getElementById(target_id).classList.remove('smooth')
		}
	}

	const onpointerup = async (e) => {
		if (document.getElementById(target_id)) {
			let current_x = e.pageX
			let offset_x = current_x - pointed_x

			if (Math.abs(offset_x) > trigger_at) {
				const timestamp = document.getElementById(target_id).dataset.timestamp
				document.getElementById(target_id).classList.add('ignored')
				document.getElementById(target_id).animate([
					{ transform: `${document.getElementById(target_id).style.transform}`, opacity: 1 },
					{ transform: `translateX(${(offset_x < 0 ? -1 : 1) * 1000}px)`, opacity: 0 },
				], {
					duration: 200,
					iterations: 1,
				}).finished.then(() => {
					fixtures[target_in].visible = false
					if (fixtures[target_in + 3]) {
						fixtures[target_in + 3].visible = true
					}
					fetched_fixtures = fetched_fixtures.filter(f => f.response.fixture.id !== target_id)
					fixtures = fixtures.filter(f => f.response.fixture.id !== target_id)
				})

				if (offset_x < 0) {
					await supabase.from('likes').insert([{ match_id: target_id, timestamp, dislike: true }])
				} else {
					await supabase.from('likes').insert([{ match_id: target_id, timestamp }])
					broadcast({ user_id: session.user.id, match_id: target_id, action: 'like' })
					const { data: d1 } = await supabase.from('likes').select('user_id').eq('match_id', target_id).neq('user_id', session.user.id).eq('dislike', false)
					// console.log(d1)

					if (d1.length > 0) {
						gsap.killTweensOf('.words')
						ITSAMATCH = true

						for (let i = 0; i < d1.length; i++) {
							console.log(d1[i].user_id)
							const { data, error } = await supabase.from('chats').insert([
								{ users: [d1[i].user_id, session.user.id] },
							]).select()
						}
					}
				}

				// likes.push(target_id) // svelte 5
				likes = [...likes, target_id] // svelte 4
			} else {
				document.getElementById(target_id).classList.add('smooth')
				document.getElementById(target_id).style.transform = `translateX(0px)`

				target_id = undefined
				pointed_x = undefined
			}
		}
	}

	const onpointermove = async (e) => {
		if (document.getElementById(target_id)) {
			let current_x = e.pageX
			let offset_x = current_x - pointed_x

			document.getElementById(target_id).style.transform = `translateX(${offset_x}px) rotate(${offset_x / 20}deg)`

			if (offset_x < trigger_at * -1) {
				document.getElementById(target_id).classList.add('on-action')
			} else if (offset_x > trigger_at) {
				document.getElementById(target_id).classList.add('on-action')
			} else {
				document.getElementById(target_id).classList.remove('on-action')
			}
		}
	}

	// 

	const getLatLon = async (city) => {
		const { lat, lon } = await(await fetch(`${PUBLIC_API_URL}/api/coords/${city}`)).json()
		// console.log(lat, lon)
		kms[city] = Number(calcCrow(data.geo.latitude, data.geo.longitude, lat, lon).toFixed(0)).toLocaleString(0)
		return { lat, lon }
	}

	const toRad = (value) => {
   		return value * Math.PI / 180
	}

	const calcCrow = (lat1, lon1, lat2, lon2) => {
		let R = 6371
		let dLat_ = toRad(lat2 - lat1)
		let dLon_ = toRad(lon2 - lon1)
		let lat1_ = toRad(lat1)
		let lat2_ = toRad(lat2)

		let a = Math.sin(dLat_ / 2) * Math.sin(dLat_ / 2) + Math.sin(dLon_ / 2) * Math.sin(dLon_ / 2) * Math.cos(lat1_) * Math.cos(lat2_)
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		let d = R * c
		return d
	}

	const getTranslation = async (text) => {
		const { translation, alternatives } = await(await fetch(`${PUBLIC_API_URL}/api/translate/${text.replace('/', ' ')}`)).json()
		return { translation, alternatives }
	}

	const getTranslation2 = async (logo) => {
		const t1 = logo.split('/')
		const t2 = +t1.at(-1).split('.').at(0)
		const { data } = await supabase.from('translations').select('translation_adl').eq('team_id', t2)
		translations[logo] = data[0].translation_adl.charAt(0).toUpperCase() + data[0].translation_adl.slice(1)
	}

	const getTranslation3 = async (where) => {
		if (where) {
			const { translation, alternatives } = await(await fetch(`${PUBLIC_API_URL}/api/translate/${where.replace('/', ' ')}`)).json()
			translations[where] = translation
		}
		
		// return { translation, alternatives }
	}

	let translations = {}
	let kms = {}

	$: show_translation = false
</script>

<svelte:window on:pointerup={onpointerup} on:pointermove={onpointermove} on:resize={recalculate} />

{#if DEBUG}
	<div class='debug'>
		<p>debug</p>
		<hr>
		<button on:click={() => {
			ITSAMATCH = !ITSAMATCH
		}}>it's a match trigger</button>
	</div>
{/if}

{#if ITSAMATCH}
	<div transition:fade class='dim'></div>
	<div class='itsamatch' in:test1>
		<div class='words' style='font-style: italic; text-align: center; color: #96f605;'>
			<span transition:fade style='font-size: 8vw; line-height: 8vw; font-weight: 600; display: flex; justify-content: center;'>
				<div>I</div>
				<div>T</div>
				<div>`</div>
				<div>S</div>
				<div style='margin-left: .5em;'>A</div>
			</span>
			<span style='font-size: 20vw; line-height: 20vw; font-weight: 800; display: flex; justify-content: center;'>
				<div>M</div>
				<div>A</div>
				<div>T</div>
				<div>C</div>
				<div>H</div>
				<div>!</div>
			</span>
		</div>
	</div>
{/if}

<div class:wrapper={true}>
	{#if !fetching}
		<div class:blocks={true}>
			{#each fixtures as fixture, i (fixture.response.fixture.id)}
				{#if fixture.visible && !fixture.disabled}
					{#await getTranslation2(fixture.response.teams.home.logo)}
					{/await}

					{#await getTranslation2(fixture.response.teams.away.logo)}
					{/await}

					{#await getTranslation3(fixture.response.fixture.venue.city)}
					{/await}

					{#await getLatLon(fixture.response.fixture.venue.city)}
					{/await}

					<div on:pointerdown={(e) => onpointerdown(e, i)} class:block={true} class:smooth={true} id={fixture.response.fixture.id} data-timestamp={fixture.response.fixture.timestamp} style='z-index: {1000 - i}'>
						<div>
							<div class='logos'>
								<img draggable='false' src={fixture.response.teams.home.logo} alt={fixture.response.teams.home.name}>
								<img draggable='false' src={fixture.response.teams.away.logo} alt={fixture.response.teams.away.name}>
							</div>
							<div class='info'>
								<div>
									<!-- {#await getTranslation(fixture.response.teams.home.name + ' ^ ' + fixture.response.teams.away.name, 1)}
										<h2>{fixture.response.teams.home.name} — {fixture.response.teams.away.name}</h2>
									{:then { translation }}
										{#if show_translation}
											<h2>{translation.replace('^', '—')}</h2>
										{:else}
											<h2>{fixture.response.teams.home.name} — {fixture.response.teams.away.name}</h2>
										{/if}
									{/await} -->

									{#if show_translation}
										{@const home = translations[fixture.response.teams.home.logo] || fixture.response.teams.home.name}
										{@const away = translations[fixture.response.teams.away.logo] || fixture.response.teams.away.name}

										<h2>{home} — {away}</h2>
									{:else}
										<h2>{fixture.response.teams.home.name} — {fixture.response.teams.away.name}</h2>
									{/if}

									{#if fixture.response.fixture.venue.city !== null && fixture.response.fixture.venue.city !== 'TBC'}
										<p class='mt-1'>
											{#if show_translation}
												<span>{translations[fixture.response.fixture.venue.city]}</span>
											{:else}
												<span>{fixture.response.fixture.venue.city}</span>
											{/if}
										</p>
										<p class='mt-1'>
											<span class='muted mt-1'>({kms[fixture.response.fixture.venue.city]} км от тебя)</span>
										</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<div class='d-flex' style='z-index: 2000; position: absolute; bottom: 1rem;'>
			<input type='date' bind:value={current_date} on:change={() => onChange('date')}>

			<select class='ml-1 md:ml-3' bind:value={country} on:change={() => onChange('country')}>
				<option value='All'>Все</option>
				{#each countries as country}
					<option value={country}>{countries_translation[country] || country}</option>
				{/each}
			</select>

			<div class='d-flex column ml-1 md:ml-3 align-center justify-center'>
				<Switch id='show_translation' bind:checked={show_translation} />
				<label class='d-none md:d-flex mt-1'>Перевод</label>
			</div>
		</div>
	{:else}
		<!-- <img class='no-select' draggable='false' src='./XyliGun.gif' alt='loading'> -->
		<Loading/>
	{/if}
</div>

<style>
	select, input {
		background: var(--palette-1);
		border: 2px solid var(--palette-2);
		border-radius: var(--border-radius);
		color: var(--palette-9);
		color-scheme: dark;
		font: inherit;
		padding: .5rem 1rem;
		outline: none;
	}

	.debug {
		padding: 1rem;
		display: block;
		background: black;
		color: white;
		top: 0;
		right: 0;
		position: absolute;
		z-index: 1000000;
	}

	.dim { 
		background: #00000088;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 10000;
	}

	.itsamatch { 
		user-select: none;
		-webkit-user-select: none;
		pointer-events: none;
		position: fixed;
		display: grid;
		place-items: center;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10001;
	}

	.wrapper {
		position: relative;
		height: 100%;
		width: 100%;
		display: grid;
		place-items: center;
		overflow: hidden;
	}

	.blocks {
		display: grid;
		place-items: center;
		position: relative;
		width: 400px;
		height: 600px;
	}

	@media only screen and (max-width: 576px) {
		.blocks {
			width: 100%;
			height: 100%;
		}
	}

	.block {
		height: inherit;
		width: inherit;
		border-radius: var(--border-radius);
		user-select: none;
		-webkit-user-select: none;
		background: var(--palette-2);
		touch-action: none;
	}

	.block .info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.block .logos {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		gap: 1rem;
		border-top-left-radius: var(--border-radius);
		border-top-right-radius: var(--border-radius);
		background: var(--palette-2);
		filter: brightness(90%);
	}

	.block .logos img {
		aspect-ratio: 1/1;
		height: 150px;
		width: 150px;
	}

	.block > * {
		pointer-events: none;
	}

	.block.smooth {
		transition: transform var(--transition-slower), filter var(--transition-slower);
	}

	.block:nth-child(1) {
		cursor: pointer;
	}

	.block:nth-child(n + 2) {
		position: absolute;
		pointer-events: none;
		cursor: not-allowed !important;
	}

	.block.on-action:not(.ignored) + .block {
		transform: translateY(0) scale(1);
		filter: brightness(100%);
	}

	.block:not(.on-action):not(.ignored) + .block {
		transform: translateY(-30px) scale(.94);
		filter: brightness(95%);
	}

	@media only screen and (max-width: 576px) {
		.block:not(.on-action):not(.ignored) + .block {
			transform: translateY(0) scale(.94);
			filter: brightness(95%);
		}
	}

	.block:nth-child(1) :is(img, p, h1, h2, h3) {
		filter: blur(0px);
	}

	.block:nth-child(2) :is(img, p, h1, h2, h3) {
		filter: blur(8px);
	}

	.block :is(img, p, h1, h2, h3) {
		transition: filter var(--transition);
	}

	.no-select {
		user-select: none;
		-webkit-user-select: none;
	}
</style>
