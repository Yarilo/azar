<script lang="ts">
	import { parseTitle } from "./utils";

	export let event;
</script>

<h1>{parseTitle(event.title)}</h1>
<p class="event-description">{event.description}</p>

<div>
	<p>{event.price} €</p>
	<a href={event.url} target="_blank">{event.url}</a>
</div>

<style>
	a {
		color: inherit;
	}
	.event-description {
		white-space: pre-line;
	}
</style>
