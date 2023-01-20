<script lang="ts">
  import OccuPlanGrid from "./OccuPlanGrid.svelte";
  import OccuPlanRows from "./OccuPlanRows.svelte";

  import { getEvents } from '$lib/helpers/readICS';
  import type { Occupation } from "$lib/types/occupations";
  
  //e.g. https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics
  export let calUrl:string;
  $: encodedCalUrl = encodeURIComponent(calUrl)
  $: url = `https://ical-proxy.onrender.com/ical?url=${encodedCalUrl}`
  
  let occupations:Occupation[] = []
  const eventsIncomingCallback = ( o:Occupation ) => {
    occupations = [...occupations, o]
  }
  
  let err = '';
  $: {
    try {
      err = '';
      if(!!calUrl) getEvents(url, eventsIncomingCallback)
    }
    catch(e) {
      err = `Error ${e}`;
    }
  }
  /*
    use different component based on different media size.
  */
	let w:Number;
	
</script>
{#if err}
Error occured: ${err}. Check calendarURL: ${url}
{/if}
{url}
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
    max-width: 820px;
  }
</style>