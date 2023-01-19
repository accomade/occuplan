<script lang="ts">
  import OccuPlanGrid from "./OccuPlanGrid.svelte";
  import OccuPlanRows from "./OccuPlanRows.svelte";

  import { streamEvents } from '$lib/helpers/readICS';
  import type { Occupation } from "$lib/types/occupations";
  
  const calUrl = encodeURIComponent('https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics')
  const url = `https://ical-proxy.onrender.com/ical/${calUrl}`
  let occupations:Occupation[] = []
  const eventsIncomingCallback = ( occupation:Occupation ) => {

  }
  

  streamEvents(url, eventsIncomingCallback)
  /*
    use different component based on different media size.
  */
	let w:Number;
	
</script>

<div class="calendar-wrapper" bind:clientWidth={w}>
  {#if w > 640}
  <OccuPlanRows {occupations} />
  {:else}
  <OccuPlanGrid {occupations} />
  {/if}
</div>

<style>
  .calendar-wrapper {
    min-width: 210px;
  }
</style>