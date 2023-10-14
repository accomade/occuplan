<script lang="ts">

  import { DateTime } from "luxon";

  import OccuPlanAvailableInfo from '../../lib/components/OccuPlanAvailableInfo.svelte';
  
  let calUrl = "https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics";
  let eventsLoading = true;

  let search=[ 1, 10, 200 ]
  let maxFutureDate=DateTime.now().plus({years: 2})


  let fromFun = (from:DateTime|null, forDays:number):string => {
    if(from == null) {
      return `No availability for ${forDays} days until ${maxFutureDate.toFormat('dd.MM.yyyy')}`
    }
    return `Min. ${forDays} days from ${from.toFormat('dd.MM.yyyy')} available`
  }

  const resultIncoming = ( e:CustomEvent ) => {
    console.log( JSON.stringify(e.detail, null, 2))
    eventsLoading = false;
  }

</script>


<main>
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
      on:result={resultIncoming}
      {maxFutureDate}
      let:available={av}
      {search}
      {calUrl}
    >
      <ul>
        {#each search as s} 
        <li>{ fromFun( av[s], s) }</li>
        {/each}
      </ul>
      
    </OccuPlanAvailableInfo>

  </section>
</main>