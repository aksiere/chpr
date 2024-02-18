<script>
	import '../app.scss'

	import { page } from '$app/stores'

	const stroke_width = 2
	const items = [
		{ href: '/chrinder', title: 'Чриндер', icon: `<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-cards' width='24' height='24' viewBox='0 0 24 24' stroke-width=${stroke_width} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M3.604 7.197l7.138 -3.109a.96 .96 0 0 1 1.27 .527l4.924 11.902a1 1 0 0 1 -.514 1.304l-7.137 3.109a.96 .96 0 0 1 -1.271 -.527l-4.924 -11.903a1 1 0 0 1 .514 -1.304z' /><path d='M15 4h1a1 1 0 0 1 1 1v3.5' /><path d='M20 6c.264 .112 .52 .217 .768 .315a1 1 0 0 1 .53 1.311l-2.298 5.374' /></svg>` },
		{ href: '/vote', title: 'Голосование', icon: `<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-checkbox' width='24' height='24' viewBox='0 0 24 24' stroke-width=${stroke_width} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M9 11l3 3l8 -8' /><path d='M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9' /></svg>` },
		{ href: '/chats', title: 'Чаты', icon: `<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-message' width='24' height='24' viewBox='0 0 24 24' stroke-width=${stroke_width} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M8 9h8' /><path d='M8 13h6' /><path d='M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z' /></svg>` },
		{ href: '/fixtures', title: 'Все матчи', disabled: true, icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-list-details" width="24" height="24" viewBox="0 0 24 24" stroke-width=${stroke_width} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 5h8" /><path d="M13 9h5" /><path d="M13 15h8" /><path d="M13 19h5" /><path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /></svg>` },
		{ href: '/motd', title: 'Матч дня', disabled: true, icon: `<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-ball-football' width='24' height='24' viewBox='0 0 24 24' stroke-width=${stroke_width} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' /><path d='M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55z' /><path d='M12 7v-4m3 13l2.5 3m-.74 -8.55l3.74 -1.45m-11.44 7.05l-2.56 2.95m.74 -8.55l-3.74 -1.45' /></svg>` },
		{ href: '/twoxd', title: '2Xдолбаеб', disabled: true, icon: `<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-database-dollar' width='24' height='24' viewBox='0 0 24 24' stroke-width=${stroke_width} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3' /><path d='M4 6v6c0 1.657 3.582 3 8 3c.415 0 .822 -.012 1.22 -.035' /><path d='M20 10v-4' /><path d='M4 12v6c0 1.657 3.582 3 8 3c.352 0 .698 -.009 1.037 -.025' /><path d='M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5' /><path d='M19 21v1m0 -8v1' /></svg>` },
		{ divider: true },
		{ href: '/me', title: 'Профиль', icon: `<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-user-circle' width='24' height='24' viewBox='0 0 24 24' stroke-width=${stroke_width} stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' /><path d='M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' /><path d='M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855' /></svg>` },
	]
</script>

<div class='app'>
	<header>
		<ul class='box d-flex p-2'>
			{#each items as { href, title, icon, disabled, divider }, i (href)}
				{#if divider}
					<li class='ml-a'></li>
				{:else}
					<li class:ml-1={i > 0} class:md:ml-2={i > 0} draggable='false' class:active={$page.url.pathname.startsWith(href)} class:disabled>
						<a {href} class='d-flex align-center p-2'>
							<span class='icon'>{@html icon}</span>
							<span class='text d-none md:d-block'>{title}</span>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</header>

	<main class='mx-2 md:mx-0'>
		<div class='100h'>
			<slot />
		</div>
	</main>

	<footer>
		<div class='box p-3 d-flex'>
			<span>Chronos Project</span>
			<span class='ml-a'>{new Date().getFullYear()}</span>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	header {
		background: var(--palette-0);
		color: var(--palette-5);
	}

	main {
		flex: 1 1 auto;
		overflow-y: auto;
		min-height: 0px;
		background: var(--palette-1);
		color: var(--palette-9);
		border-radius: var(--border-radius);
	}

	footer {
		background: var(--palette-0);
		color: var(--palette-5);
	}

	ul {
		list-style: none;
		display: flex;
		margin: 0;
		padding: 0;

		& > li {
			transition: all var(--transition);
			user-select: none;
			-webkit-user-select: none;
			border-radius: var(--border-radius);

			&.disabled {
				pointer-events: none;
				opacity: .5;
			}

			&:hover {
				color: var(--palette-8);
			}

			&.active {
				color: var(--palette-9);
				background: var(--palette-1);
			}

			& .icon {
				line-height: 0;
				
				& + .text {
					margin-left: .5rem;
				}
			}
		}
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
