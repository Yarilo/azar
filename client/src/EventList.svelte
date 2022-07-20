<script lang="ts">
    import { getEventUrl, parseTitle, parseDate } from "./utils/";
    import { link } from "svelte-routing";

    export let events = [];
    export let onClickEvent;
</script>

<ul class="event-list">
    {#each events as event}
        <li>
            <h2>
                <a
                    on:click={() => onClickEvent(event)}
                    href={getEventUrl(event)}
                    use:link>{parseTitle(event.title)}</a
                >
            </h2>
            <div class="event-subtitle">
                <small>{event.place.name}</small>
                <small>{parseDate(event.date)}</small>
            </div>
        </li>
    {/each}
</ul>

<style>
    a {
        color: inherit;
    }

    .event-subtitle {
        display: flex;
        justify-content: space-between;
    }
    .event-list {
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        height: 50%;
        justify-content: space-evenly;
    }
    .event-list h2 {
        margin-bottom: 10px;
    }
</style>
