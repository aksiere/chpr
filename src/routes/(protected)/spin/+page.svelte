<script>
	import { enhance } from '$app/forms'
	import { onDestroy } from 'svelte'
	import { browser } from '$app/environment'

	import Button from '$lib/components/Button.svelte'
	import { blur, fly, fade, scale } from 'svelte/transition'

	$: items = []

	export let data
	$: ({ availableSpins } = data)

	let wrapper
	let worker
	let wrapperInnerWidth

	onDestroy(() => {
		worker?.terminate()
	})

	let showModal = false
	let spinning = false
	let spin_text = 'Крутить!'

	const reset = () => {
		worker?.terminate()
	}

	const spin = (n, offset = 50) => {
		spinning = true
		spin_text = 'Крутим...'
		availableSpins--
		const SCROLL_LEFT = n * 200 + 16 * (n-1) - wrapperInnerWidth / 2 - (200 - 200 / 100 * offset)

		let scrolled = 0
		let modifier = 10

		const workerURL = new URL('./worker.js', import.meta.url).href

		worker = new Worker(workerURL)
		worker.onmessage = function () {
			scrolled += modifier

			wrapper.scroll({
				left: scrolled
			})

			if (scrolled > SCROLL_LEFT - 7000) modifier = 8
			if (scrolled > SCROLL_LEFT - 5000) modifier = 6
			if (scrolled > SCROLL_LEFT - 4000) modifier = 5
			if (scrolled > SCROLL_LEFT - 3000) modifier = 4
			if (scrolled > SCROLL_LEFT - 1500) modifier = 3
			if (scrolled > SCROLL_LEFT - 500) modifier = 2
			if (scrolled > SCROLL_LEFT - 250) modifier = 1
			if (scrolled > SCROLL_LEFT - 200) modifier = 0.8
			if (scrolled > SCROLL_LEFT - 150) modifier = 0.6
			if (scrolled > SCROLL_LEFT - 100) modifier = 0.4
			if (scrolled > SCROLL_LEFT - 50) modifier = 0.2
			if (scrolled > SCROLL_LEFT) modifier = 0
			if (modifier === 0) {
				reset()
				showModal = true
				spinning = false
				spin_text = 'Крутить!'
			}
		}
	}

	let error = ''
</script>

{#if items}
	{#if showModal}
		<div class='dim p-3' transition:fade={{ duration: 250 }}>
			<div class='modal 80w md:60w xl:30w' in:scale={{ start: .75, duration: 250 }} out:scale={{ start: 1.25, duration: 250 }}>
				<p class='muted' style='font-size: 12px; font-weight: 600; text-align: center;'>ВАШ ВЫИГРЫШ</p>
				<div class='py-5' style="text-align: center;">
					<h2>{items[80] ? items[80].title : 'Нихуя'}</h2>
					<h4>x{items[80] ? items[80].amount : '0'}</h4>
				</div>
				<Button on:click={() => showModal = false}>Заебись!</Button>
			</div>
		</div>
	{/if}
{/if}

<div class='box p-3 100h'>
	<div class='indicator'>
		<div></div>
		<div></div>
		<div></div>
	</div>

	<div class='wrapper my-2' bind:this={wrapper} bind:clientWidth={wrapperInnerWidth}>
		<div class='indicator'></div>
		<div class='items'>
			{#if items}
				{#each items as { icon, title, rarity }, i}
					<div class='item {rarity}'>
						{@html icon || title || ''}
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<div class='indicator'>
		<div></div>
		<div></div>
		<div></div>
	</div>

	<div class="flex">
		<div class="1/1">
			<!-- <Button on:click={() => showModal = true} /> -->
			<!-- <Wheel /> -->
			<form method='post' on:submit={() => {
				spin_text = 'Тасуем...'
				spinning = true
			}} use:enhance={() => {
				return async ({ result }) => {
					console.log(result)
					if (result.data.error) {
						error = result.data.message
					} else {
						items = result.data.items
						spin(81, result.data.offset)
						availableSpins += result.data.add_spins
					}
				}
			}}>
				<Button disabled={availableSpins === 0 || spinning} type='submit'>{spin_text}</Button>
			</form>
		</div>
		<div class="1/6">
			Доступно круток: x{availableSpins}
		</div>
	</div>
</div>

<style>
	.dim {
		display: block;
		background: #00000022;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 99;
		word-wrap: break-word;
	}

	.modal {
		display: block;
		position: fixed;
		overflow-x: hidden;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--palette-2);
		padding: 1rem;
		border-radius: var(--border-radius);
		z-index: 100;
	}

	.indicator {
		width: 100%;
		height: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;

		mask-image: linear-gradient(
			var(--mask-direction, to right),
			hsl(0 0% 0% / 0),
			var(--palette-1), 20%,
			var(--palette-1) 80%,
			hsl(0 0% 0% / 0)
		);

		& div:nth-child(1),
		& div:nth-child(3) {
			background: var(--palette-3);
			flex-grow: 2;
			height: 1px;
		}

		& div:nth-child(2) {
			background: var(--palette-8);
			flex-shrink: 1;
			width: 3px;
			height: 3px;
		}
	}

	.wrapper {
		display: flex;
		height: 250px;
		position: relative;
		overflow-x: hidden;
		mask-image: linear-gradient(
			var(--mask-direction, to right),
			hsl(0 0% 0% / 0),
			var(--palette-1), 20%,
			var(--palette-1) 80%,
			hsl(0 0% 0% / 0)
		);

		& .items {
			display: flex;
			white-space: nowrap;
			padding-block: 4rem;

			& .item {
				display: grid;
				place-items: center;
				position: relative;
				background: var(--palette-2);
				border: 1px solid transparent;
				border-radius: var(--border-radius);
				height: 100%;
				width: 200px;
				color: var(--palette-6);

				& + & {
					margin-left: 1rem;
				}

				&.uncommon {
					border-color: #016604;
				}

				&.rare {
					border-color: #008dd4;
					border-width: 2px;
				}

				&.epic {
					border-color: #8a2be2;
					border-width: 2px;
					-webkit-box-shadow: #FFF 0 -1px 4px, #8a2be2 0 -10px 20px, 0px 15px 35px -6px rgba(0,0,0,0); 
					box-shadow: #FFF 0 -1px 4px, #8a2be2 0 -10px 20px, 0px 15px 35px -6px rgba(0,0,0,0);
				}

				&.legendary {
					border-color: transparent;
					background: rgb(236, 239, 207);
					color: black;
					-webkit-box-shadow: #FFF 0 -1px 4px, #ff0 0 -2px 10px, #de6e0e 0 -10px 20px, #F49E52 0 -18px 40px, 0px 0px 35px -10px rgba(0,0,0,0); 
					box-shadow: #FFF 0 -1px 4px, #ff0 0 -2px 10px, #de6e0e 0 -10px 20px, #F49E52 0 -18px 40px, 0px 0px 35px -10px rgba(0,0,0,0);
				}
			}
		}
	}
</style>
