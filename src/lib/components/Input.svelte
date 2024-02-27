<script>
	export let fluid
	export let label
	export let value
	export let _this
</script>

<div class='wrapper'>
	{#if label}
		<p class='label mb-2'>{label}</p>
	{/if}
	<slot/>
	<input type='text' bind:this={_this} bind:value={value} {...$$restProps} class:fluid={fluid}>
	<!-- <div class='bg'></div> -->
</div>

<style>
	.wrapper {
		padding: 2px;

		& input {
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
			transition: outline-color var(--transition), z-index calc(var(--transition-speed) * 2) ease-out;

			&:focus {
				outline-color: var(--primary);
			}

			&.fluid {
				width: 100%;
			}

			& .label {
				z-index: 1;
				position: relative;
				color: var(--palette-6);
			}
		}

		&:focus-within {
			& input, & .label {
				z-index: 3;
			}

			& .label {
				color: var(--palette-9);
			}
		}
	}
</style>
