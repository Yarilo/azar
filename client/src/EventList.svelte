<script lang="ts">
    import { getEventUrl, parseTitle } from "./utils/";

    export let events = [];
    export let onClickEvent;

    const parseDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes() === 0 ? "00" : date.getMinutes();
        return `${hours}:${minutes}h`;
    };
</script>

<ul class="event-list">
    {#each events as event}
        <li on:click={() => onClickEvent(event)}>
            <h2><a href={getEventUrl(event)}>{parseTitle(event.title)}</a></h2>
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
