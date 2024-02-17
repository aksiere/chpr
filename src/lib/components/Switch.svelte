<script>
	export let id
	export let small
	export let large
	export let colored
	export let disabled
	export let checked
</script>

<div class:wrapper={true} class:disabled>
	<input type='checkbox' bind:checked={checked} {id} {...$$restProps}>
	<label class:small class:large class:colored for={id}>
		<div></div>
	</label>
</div>

<style>
	/* 
	--switch-background
	--switch-background-colored
	--switch-size
	--switch-padding

	*/

	.wrapper {
		display: flex;
		width: auto;
		align-items: center;
		user-select: none;
		-webkit-user-select: none;
	}

	.wrapper.disabled {
		/* opacity: .25; */
		pointer-events: none;
	}

	.wrapper.disabled > label > div {
		visibility: hidden;
	}

	.wrapper > input {
		display: none;
	}

	.wrapper > input:checked + label {
		background: var(--switch-background, var(--palette-9, #000000));
	}

	.wrapper > input:checked + label.colored {
		background: var(--switch-background-colored, var(--primary, #6374ce));
	}

	.wrapper > input:checked + label > div {
		transform: translateX(var(--component-switch-size));
	}

	.wrapper > label {
		--component-switch-size: var(--switch-size, 20px);
		--component-switch-padding: var(--switch-padding, 2px);
		
		display: inline-block;
		width: calc(var(--component-switch-size) * 2);
		box-sizing: content-box;
		background: var(--switch-background-label, var(--palette-3, #eeeeee));
		border-radius: var(--switch-border-radius, 132rem);
		padding: var(--component-switch-padding);
		transition: background-color var(--transition);
		cursor: pointer;
	}

	.wrapper > label.small {
		--component-switch-size: calc(var(--switch-size, 20px) - 8px);
	}

	.wrapper > label.large {
		--component-switch-size: calc(var(--switch-size, 20px) + 8px);
	}

	.wrapper > label > div {
		cursor: pointer;
		width: var(--component-switch-size);
		height: var(--component-switch-size);
		background: var(--switch-background-toggle, var(--palette-1, #fff));
		border-radius: calc(var(--switch-border-radius, 132rem) - var(--component-switch-padding));
		transition: transform var(--transition);
	}
</style>
