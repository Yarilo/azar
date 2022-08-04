<script lang="ts">
	import { parseTitle, parseDate } from "./utils";
	import ArrowUpRight from "./icons/ArrowUpRight.svelte";

	export let event;
	// @TODO: Perhaps put an arrow
	const priceEvent = event.price === 0 ? "Gratis" : `${event.price} €`;
</script>

{#if event}
	<h1>{parseTitle(event.title)}</h1>
	<p class="event-description">{event.description}</p>

	<br />
	<p />

	<div>
		<a href={event.url} target="_blank">{event.place.name}</a>
		<a class="external-link-icon" href={event.url} target="_blank">
			<ArrowUpRight /></a
		>

		<p>{parseDate(event.date)}</p>
		<p>{priceEvent}</p>
	</div>
{/if}

<style>
	.external-link-icon {
		position: relative;
		top: 2px;
	}
	a {
		color: inherit;
	}
	.event-description {
		white-space: pre-line;
	}
</style>
