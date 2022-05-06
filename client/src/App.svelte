<script lang="ts">
    import * as axios from 'axios';
	import {onMount} from 'svelte';

	let request;
	let currentEvents = [];

	let BASE_SERVER_URL = 'http://localhost:4242'
	onMount(async () => {
        request = axios.create({
			baseURL: BASE_SERVER_URL,
		});
		 const response = await request.get(`/events`);
		 currentEvents = response.data;
		 console.log('CURRENT EVENTS', currentEvents)
       })

</script>

<div class='layout'>
	<div class='title'>
		<h1>Azar</h1>
	</div>
	<ul class='event-list'>
		{#each currentEvents as event}
		<li>
			<h2>{event.title}</h2>
			<p>{event.description}</p>
		</li>
		{/each}
	</ul>
</div>

<style>
	 .layout {
		 display:flex;
		 flex-direction: column;
		 justify-content: center;
		 align-items: center;
		 height: 100%;
		 width: 100%;
	 }
</style>
