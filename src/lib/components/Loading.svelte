<div class:wrapper={true}>
	<div class:loading={true}>
		<div></div>
		<div></div>
	</div>
</div>

<style>
	.wrapper {
		--size: 30px;

		width: inherit;
		height: inherit;
		display: grid;
		place-items: center;
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
</style>
