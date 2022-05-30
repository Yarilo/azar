<script lang="ts">
 export let event;
</script>

<h1>{event.title}</h1>
<p>{event.description}</p>

<div>
    <p>{event.price} €</p>
    <a href={event.url}>{event.url}</a>
</div>
<style>
	a {
 		color: inherit;
	}
	 
</style>
