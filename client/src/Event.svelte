<script lang="ts">
	import { parseTitle, parseDate } from "./utils";

	export let event;
	// @TODO: Perhaps put an arrow
</script>

<h1>{parseTitle(event.title)}</h1>
<p class="event-description">{event.description}</p>

<br />
<p />

<div>
	<a href={event.url} target="_blank">{event.place.name}</a>
	<p>{parseDate(event.date)}</p>
	<p>{event.price} €</p>
</div>

<style>
	a {
		color: inherit;
	}
	.event-description {
		white-space: pre-line;
	}
</style>
