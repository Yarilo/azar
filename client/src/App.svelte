<script lang="ts">
	import { Router, Route, link, navigate } from "svelte-routing";
	import { onMount } from "svelte";
	import * as axios from "axios";
	import { getEventUrl } from "./utils/";
	import Event from "./Event.svelte";
	import EventList from "./EventList.svelte";
	import DoorClosed from "./icons/DoorClosed.svelte";
	import DoorOpen from "./icons/DoorOpen.svelte";

	let currentEvents = [];
	let location = window.location.pathname.split("/")[1];
	let selectedEvent = null;
	let fetchingEvents = false;

	const LOCALHOST = "http://localhost";
	const AZAR_SERVER_URL = "https://azar.deno.dev";

	const TODAY = "/today";
	const ICON_DOOR_SIZE = 40;
	const BASE_SERVER_URL = window.location.href.includes(LOCALHOST)
		? LOCALHOST
		: AZAR_SERVER_URL;

	const requestEvents = async () => {
		fetchingEvents = true;
		const request = axios.create({ baseURL: BASE_SERVER_URL });
		const response = await request.get(`/api/events/today`);
		fetchingEvents = false;
		return response.data;
	};

	const onClickArrow = async () => {
		currentEvents = await requestEvents();
	};

	const onClickEvent = (event) => {
		selectedEvent = event;
	};

	const onClickTitle = () => {
		// On click without selected event, go to home
		if (selectedEvent) selectedEvent = null;
		currentEvents = [];
	};

	onMount(async () => {
		if (currentEvents.length === 0) {
			currentEvents = await requestEvents();
			const eventNameInLocation = window.location.pathname.slice(1);

			const eventSelectedInLocation = currentEvents.find((e) => {
				return getEventUrl(e) === eventNameInLocation;
			});
			if (eventSelectedInLocation) {
				selectedEvent = eventSelectedInLocation;
				navigate(`/${getEventUrl(eventSelectedInLocation)}`);
			}
		}
	});

	let doorOpen = false;
	const switchDoor = (status: boolean) => {
		doorOpen = status;
	};
	// @TODO: There is a brief blink while loading events
	// @TODO: Reorganize routes below
</script>

<div class={`layout ${location === TODAY || selectedEvent ? "" : "initial"}`}>
	<Router>
		<Route path={"/"} let:params>
			<div class={"title"} on:click={onClickTitle}>
				<a href={"/"} use:link><h1>Azar</h1></a>
			</div>
			<div
				on:click={onClickArrow}
				on:mouseenter={() => switchDoor(true)}
				on:mouseleave={() => switchDoor(false)}
			>
				<a href={TODAY} use:link>
					{#if doorOpen}
						<DoorOpen size={ICON_DOOR_SIZE} />
					{:else}
						<DoorClosed size={ICON_DOOR_SIZE} />
					{/if}
				</a>
			</div>
		</Route>
		<Route path={TODAY} let:params>
			<div class={"title"} on:click={onClickTitle}>
				<a href={"/"} use:link><h1>Azar</h1></a>
			</div>
			{#if fetchingEvents}
				<div>...</div>
			{:else}
				<EventList {onClickEvent} events={currentEvents} />
			{/if}
		</Route>
		<Route path={`${TODAY}/*`} let:params>
			<div class={"title-event"} on:click={onClickTitle}>
				<a href={"/"} use:link><h1>Azar</h1></a>
			</div>
			<div class="event">
				<Event event={selectedEvent} />
			</div>
		</Route>
	</Router>
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
		.title-event h1 {
			top: 0;
			left: 30px; /* left-padding of layout value */
		}
	}
</style>
