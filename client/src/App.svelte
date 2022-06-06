<script lang="ts">
	import * as axios from "axios";
	import { ArrowRightIcon } from "svelte-feather-icons";
	import { getEventUrl } from "./utils/";
	import Event from "./Event.svelte";
	import EventList from "./EventList.svelte";
	let request;
	let currentEvents = [];

	let BASE_SERVER_URL = "http://localhost:4242";

	let location = window.location.href.split("#")[1];

	let selectedEvent = null;

	const requestEvents = async () => {
		request = axios.create({ baseURL: BASE_SERVER_URL });
		const response = await request.get(`/events/today`);
		currentEvents = response.data;
	};

	const onClickEvent = (event) => {
		selectedEvent = event;
		location = getEventUrl(event);
	};

	const onClickTitle = () => {
		if (selectedEvent) selectedEvent = null;
	};
</script>

<div class={"layout"}>
	<div
		class={`${selectedEvent ? "title-event" : "title"}`}
		on:click={onClickTitle}
	>
		<h1>Azar</h1>
	</div>
	{#if selectedEvent}
		<div class="event">
			<Event event={selectedEvent} />
		</div>
	{:else if currentEvents.length > 0}
		<EventList {onClickEvent} events={currentEvents} />
	{:else}
		<div class="show-events-icon" on:click={requestEvents}>
			<ArrowRightIcon />
		</div>
	{/if}
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}
	.layout h1 {
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
