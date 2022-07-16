<script lang="ts">
	import { onMount } from "svelte";
	import * as axios from "axios";
	import { getEventUrl } from "./utils/";
	import Event from "./Event.svelte";
	import EventList from "./EventList.svelte";
	import DoorClosed from "./icons/DoorClosed.svelte";
	import DoorOpen from "./icons/DoorOpen.svelte";

	let currentEvents = [];
	let location = `#${window.location.href.split("#")[1]}`;
	let selectedEvent = null;
	let fetchingEvents = false;

	const LOCALHOST = "http://localhost";
	const AZAR_SERVER_URL = "https://azar.deno.dev";

	const TODAY = "#today";
	const ICON_DOOR_SIZE = 40;
	const BASE_SERVER_URL = window.location.href.includes(LOCALHOST)
		? LOCALHOST
		: AZAR_SERVER_URL;

	const requestEvents = async () => {
		fetchingEvents = true;
		const request = axios.create({ baseURL: BASE_SERVER_URL });
		const response = await request.get(`/events/today`);
		fetchingEvents = false;
		return response.data;
	};

	const onClickArrow = async () => {
		location = TODAY;
		currentEvents = await requestEvents();
	};

	const onClickEvent = (event) => {
		selectedEvent = event;
		location = getEventUrl(event);
	};

	const onClickTitle = () => {
		// On click without selected event, go to home
		if (selectedEvent) selectedEvent = null;
		currentEvents = [];
		location = "";
	};

	onMount(async () => {
		if (location !== "" && currentEvents.length === 0) {
			currentEvents = await requestEvents();
			const eventSelectedInLocation = currentEvents.find(
				(e) => getEventUrl(e) === location
			);
			if (eventSelectedInLocation) {
				location === getEventUrl(eventSelectedInLocation);
				selectedEvent = eventSelectedInLocation;
			}
		}
	});

	let doorOpen = false;
	const switchDoor = (status: boolean) => {
		doorOpen = status;
	};

	// @TODO: There is a brief blink while loading events
</script>

<div class={`layout ${!location || location === "#" ? "initial" : ""}`}>
	{#if fetchingEvents && location === TODAY}
		<div>...</div>
	{:else}
		<div
			class={`${selectedEvent ? "title-event" : "title"}`}
			on:click={onClickTitle}
		>
			<a href="#"><h1>Azar</h1></a>
		</div>
		{#if selectedEvent}
			<div class="event">
				<Event event={selectedEvent} />
			</div>
		{:else if location === TODAY}
			<EventList {onClickEvent} events={currentEvents} />
		{:else}
			<div
				on:click={onClickArrow}
				on:mouseenter={() => switchDoor(true)}
				on:mouseleave={() => switchDoor(false)}
			>
				<a href={TODAY}>
					{#if doorOpen}
						<DoorOpen size={ICON_DOOR_SIZE} />
					{:else}
						<DoorClosed size={ICON_DOOR_SIZE} />
					{/if}
				</a>
			</div>
		{/if}
	{/if}
</div>

<style>
	a {
		color: inherit;
		text-decoration: inherit;
	}
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
	.title {
		cursor: pointer;
	}

	.title-event h1 {
		font-size: 48px;
		position: absolute;
		top: 0;
		left: 40px;
		cursor: pointer;
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

	@media (max-width: 800px) {
		.layout {
			width: 70%;
			padding-left: 30px;
			padding-right: 30px;
			padding-bottom: 0px;
		}
		.layout.initial {
			width: initial;
		}
		.event {
			max-height: 70%;
			width: 100%;
		}
	}
</style>
