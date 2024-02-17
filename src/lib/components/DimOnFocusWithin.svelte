<div>
	<div></div>
	<slot />
</div>

<style>
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
		transition: all var(--transition);
	}
	
	div:focus-within > div {
		background: #00000044;
	}
</style>
