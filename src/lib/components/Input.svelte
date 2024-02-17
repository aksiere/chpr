<script>
	export let fluid
	export let label
	export let value
</script>

<div class='wrapper'>
	{#if label}
		<p class='label mb-2'>{label}</p>
	{/if}
	<input type='text' bind:value={value} {...$$restProps} class:fluid={fluid}>
	<!-- <div class='bg'></div> -->
</div>

<style>
	.wrapper input {
		border: none;
		outline: 2px solid transparent;
		outline-offset: 2px;
		border: 2px solid var(--palette-2);
		background: var(--palette-2);
		padding: .5rem .75rem;
		border-radius: var(--border-radius);
		font: inherit;
		color: inherit;
		z-index: 1;
		position: relative;
	}

	.wrapper input.fluid {
		width: 100%;
	}

	.wrapper .label {
		z-index: 1;
		position: relative;
		color: var(--palette-6);
	}

	.wrapper:focus-within input,
	.wrapper:focus-within .label {
		z-index: 3;
	}

	.wrapper:focus-within .label {
		color: var(--palette-9);
	}
</style>
