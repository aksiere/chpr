<script>
	export let fluid
	export let marquee
	export let duration = 3
	export let disabled

	let data
</script>

<button class:marquee class:fluid {...$$restProps} {disabled} style='--duration: {duration}s' on:click>
	{#if marquee}
		<span class='sign'>
			<span bind:this={data} data-text={data?.innerText}>
				<slot>Button</slot>
			</span>
		</span>
	{:else}
		<slot>Button</slot>
	{/if}
</button>

<style>
	button {
		background: var(--primary);
		color: var(--palette-9);
		outline: 2px solid transparent;
		outline-offset: 2px;
		border: none;
		border-radius: var(--border-radius);
		font: inherit;
		user-select: none;
		-webkit-user-select: none;
		padding: .75rem 1.5rem;
		transition: all var(--transition);
		cursor: pointer;
		position: relative;
		z-index: 3;

		&:hover {
			outline-color: var(--palette-2);
		}

		&:active {
			outline-color: var(--palette-3);
		}

		&.fluid {
			width: 100%;
		}

		&[disabled] {
			pointer-events: none;
			opacity: .5;
		}

		&.marquee {
			white-space: nowrap;
			padding: 0;

			& .sign {
				display: block;
				overflow: hidden;

				& span {
					position: relative;
					display: inline-block;
					padding-block: 0.75rem;
					animation: marquee var(--duration) linear infinite;
					font-weight: 500;

					&, &::after {
						padding-inline: 1.5rem;
					}

					&::after {
						content: attr(data-text);
						position: absolute;
						left: 100%;
					}
				}
			}
		}
	}

	@keyframes -global-marquee {
		0% {
			-webkit-transform: translate3d(0, 0, 0);
			-moz-transform: translate3d(0, 0, 0);
			transform: translate3d(0, 0, 0);
		}

		100% {
			-webkit-transform: translate3d(-100%, 0, 0);
			-moz-transform: translate3d(-100%, 0, 0);
			transform: translate3d(-100%, 0, 0);
		}
	}
</style>
