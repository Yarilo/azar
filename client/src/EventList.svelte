<script lang="ts">
    import { getEventUrl } from "./utils/";

	export let events = [];
    export let onClickEvent;

    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    export const parseTitle = (title) => capitalize(title.toLowerCase());
</script>
    <ul class='event-list'>
            {#each events as event}
            <li on:click={() => onClickEvent(event)}>
                <h2><a href={getEventUrl(event)}>{parseTitle(event.title)}</a></h2>
            </li>
        {/each}
    </ul>

<style>
	a {
 		color: inherit;
	}

	 .event-list {
		display: flex;
		flex-direction: column;
		padding-left: 10px;
	 }

	 
</style>
