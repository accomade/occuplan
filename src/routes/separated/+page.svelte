<script lang="ts">
  import OccuplanRows from '../../lib/components/OccuPlanRows.svelte'
  import OccuPlanGrid from "../../lib/components/OccuPlanGrid.svelte";
  import OccuPlanAvailableInfo from '../../lib/components/OccuPlanAvailableInfo.svelte';
  import type { Occupation, OccupationType } from "$lib/types/occupations";
  import { DateTime } from "luxon";

  let reservationType:OccupationType = {
    name: "reservation",
    backgroundColor: "orange",
    fontColor: "black",
  }

  let occupations:Occupation[] = [
    {
      arrival: DateTime.now(),
      leave: DateTime.now().plus({weeks: 1}),
    },
    {
      arrival: DateTime.fromISO("2023-04-30T12:00:00"),
      leave: DateTime.fromISO("2023-05-12T12:00:00"),
    },
    {
      arrival: DateTime.fromISO("2023-03-30T12:00:00"),
      leave: DateTime.fromISO("2023-04-12T12:00:00"),
      type: reservationType
    },
    {
      arrival: DateTime.fromISO("2023-04-12T12:00:00"),
      leave: DateTime.fromISO("2023-04-15T12:00:00"),
    }


  ];

  let calUrl = "https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics";
  let eventsLoading = true;


</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main>
  <h2>RowsExample</h2>
  <section>
    <OccuplanRows {occupations}/>
  </section>

  <h2>GridExample</h2>
  <section>
    <OccuPlanGrid {occupations}/>
  </section>

  <h2>Availability Example</h2>
  <section>
    <div style="margin-bottom: 2rem;">
      {#if eventsLoading}
      Loading Events! Hang tight!
      {:else}
      Displaying events from: {calUrl}
      {/if}
    </div>
    <OccuPlanAvailableInfo 
      bind:loading={eventsLoading}
      {calUrl}
    />

  </section>
</main>



<style>
  :global( button ) {
    background-color: wheat;
  }


</style>