<script lang="ts">
    import * as axios from 'axios';
	import { ArrowRightCircleIcon } from 'svelte-feather-icons'
	import Event from './Event.svelte';
	let request;
	let currentEvents = [];

	let BASE_SERVER_URL = 'http://localhost:4242'

	let location = window.location.href.split('#')[1];

	let selectedEvent = null;

	const getEventUrl = (event) => `#${event.title.replace(new RegExp(' ', 'g'),'')}`
	const requestEvents = async () => {
		request = axios.create({baseURL: BASE_SERVER_URL});
		const response = await request.get(`/events/today`);
		currentEvents = response.data;       
	}

	const onClickEvent = (event) => {
		selectedEvent = event;
		location = getEventUrl(event)
		console.log('location', location)
	}

	const onClickTitle = () => {
		if (selectedEvent) selectedEvent = null;
	}


</script>

<div class={'layout'}>
	<div class={`${selectedEvent? 'title-event' :'title'}`} on:click={onClickTitle}>
		<h1>Azar</h1>
	</div>
	{#if selectedEvent}
		<div class='event'>
			<Event event={selectedEvent} />
		</div>
	{:else}
		{#if currentEvents.length > 0}
			<ul class='event-list'>
				{#each currentEvents as event}
				<li on:click={() => onClickEvent(event)}>
					<h2><a href={getEventUrl(event)}>{event.title}</a></h2>
				</li>
			{/each}
		</ul>
		{:else}
		<div class='show-events-icon' on:click={requestEvents}>
			<ArrowRightCircleIcon  />
		</div>
		{/if}
	{/if}
</div>

<style>
	a {
 		color: inherit;
	}
	 .layout {
		 display:flex;
		 flex-direction: column;
		 justify-content: center;
		 align-items: center;
		 height: 100%;
		 width: 100%;
	 }
	 .layout  h1 {
		 font-size: 128px;
	 }

	 .title-event h1 {
		 font-size: 48px;
		 position: absolute;
		 top: 0;
		 left: 40px;
		 cursor: pointer;
	 }

	 .start-circle {
		cursor: pointer;
		height: 25px;
		width: 25px;
		background-color: white;
		border-radius: 50%;
	 }

	.event {
		display: flex;
		flex-direction: column;
		width: 50%;
		padding: 20px;
	}
	 .event-list {
		display: flex;
		flex-direction: column;
		padding-left: 10px;
	 }

	 .show-events-icon {
		 cursor: pointer;
	 }
	 
</style>
