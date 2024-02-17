<script>
	export let opacity = 20
	export let color = '0 0% 0%'
</script>

<div style='--opacity: {opacity}; --color: {color}'>
	<div></div>
	<slot />
</div>

<style>
	div {
		height: inherit;
	}

	div > div {
		pointer-events: none;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 2;
		top: 0;
		left: 0;
		background: transparent;
		display: block;
		transition: all var(--transition-speed) var(--transition-type);
		/* transition: 0; */
	}
	
	div:focus-within > div {
		background: hsla(var(--color) / calc(var(--opacity) / 100));
	}
</style>
