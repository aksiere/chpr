<script>
	export let cat
</script>

<div class:wrapper={true}>
	{#if cat}
		<img src={cat} alt='кот.' height='100px'>	
	{:else}
		<div class:loading={true}>
			<div></div>
			<div></div>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		--size: 30px;

		width: inherit;
		height: inherit;
		display: grid;
		place-items: center;
	}

	.wrapper img {
		animation: pulse 10s infinite ease-in-out;
		position: fixed;

	}

	.loading {
		height: calc(var(--size) * 2);
	}

	.loading > div {
		display: block;
		width: var(--size);
		height: var(--size);
		mix-blend-mode: difference;
		transform: rotate(45deg);
		border-radius: calc(var(--size) / 5);
		transition: transform var(--transition);
		/* animation: rotate 1s infinite ease-in-out; */
	}

	.loading > div:nth-child(1) {
		background: #8ea1ff;
		margin-bottom: -10px;
		animation: rotate 1s infinite ease-in-out;
		/* animation: upper 2s infinite ease-in-out; */
	}

	.loading > div:nth-child(2) {
		background: #ffffff;
		margin-top: -10px;
		animation: rotate 1s infinite reverse ease-in-out;
		/* animation: lower 2s infinite ease-in-out; */
	}

	@keyframes -global-rotate {
		from { transform: rotate(45deg); }
		to { transform: rotate(-45deg); }
	}

	@keyframes -global-pulse {
		from { transform: scale(1); }
		to { transform: scale(100); }
	}
</style>
