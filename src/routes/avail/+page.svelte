<script lang="ts">

  import { DateTime } from "luxon";
  import type { Occupation } from '$lib';

  import OccuPlanAvailableInfo from '../../lib/components/OccuPlanAvailableInfo.svelte';
  
  let calUrl = "https://accoma.de/ical?user=81e66599-ac3c-4ad6-b261-fceeb784f9e9&acco=83cd06fd-858d-4e21-994f-325778812713" 
  
  //"https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics";
  
  let eventsLoading = $state(true);

  let search = $state([ 1, 10, 200 ])
  let maxFutureDate = DateTime.now().plus({years: 2})


  let fromFun = (from:DateTime|null, forDays:number):string => {
    if(from == null) {
      return `No availability for ${forDays} days until ${maxFutureDate.toFormat('dd.MM.yyyy')}`
    }
    return `Min. ${forDays} days from ${from.toFormat('dd.MM.yyyy')} available`
  }

  const resultIncoming = ( e:CustomEvent ) => {
    //console.log( JSON.stringify(e.detail, null, 2))
    eventsLoading = false;
  }

  const makeDeleteSearchHandler = (index:number) => {
    //console.log(index)
    return () => {
      //console.log(index, search)
      search.splice(index,1)
      search = search
      //console.log(search)
    }
  }

  let newSpan = $state(1);
  const addHandler = () => {
    search = [...search, newSpan]
  }

  const occupations:Occupation[] = [
    {
      arrival: DateTime.utc().plus({days: 1}),
      leave: DateTime.utc().plus({days: 3}),
    },
    {
      arrival: DateTime.utc().plus({days: 3}),
      leave: DateTime.utc().plus({days: 8}),
    },
    {
      arrival: DateTime.utc().plus({days: 13}),
      leave: DateTime.utc().plus({days: 18}),
    },
    {
      arrival: DateTime.utc().plus({days: 18}),
      leave: DateTime.utc().plus({days: 22}),
    },
    {
      arrival: DateTime.utc().plus({days: 33}),
      leave: DateTime.utc().plus({days: 40}),
    },
    {
      arrival: DateTime.utc().plus({days: 34}),
      leave: DateTime.utc().plus({days: 54}),
    },
  ]

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
      
      {search}
      {calUrl}
    >
      {#snippet children({ available: av })}
            <ul>
          {#each search as s} 
          <li>{ fromFun( av[s], s) }</li>
          {/each}
        </ul>
                {/snippet}
        </OccuPlanAvailableInfo>
  </section>
  <hr>
  <section class="input">
    <ul>
      {#each search as currentSearch, i} 
      <li><span>{currentSearch}</span><button onclick={makeDeleteSearchHandler(i)}>DELETE</button></li>
      {/each}
    </ul>
    <div>
        <input type="number" bind:value={newSpan} max="100" min="1">
        <button onclick={addHandler}>Add</button>
    </div>
  </section>
  <hr/>
  <section>
    <OccuPlanAvailableInfo 
      {maxFutureDate}
      
      {search}
      {occupations}
      >
      {#snippet children({ available: av })}
            <ul>
          {#each search as s} 
          <li>{ fromFun( av[s], s) }</li>
          {/each}
        </ul>
                {/snippet}
        </OccuPlanAvailableInfo>
  </section>
  <hr/>
  <h2>Availability Example empty CalUrl</h2>
  <section>
    <OccuPlanAvailableInfo 
      on:result={resultIncoming}
      {maxFutureDate}
      
      {search}
      calUrl=""
    >
      {#snippet children({ available: av })}
            <ul>
          {#each search as s} 
            <li>{ fromFun( av[s], s) }</li>
          {/each}
        </ul>
                {/snippet}
        </OccuPlanAvailableInfo>

  </section>
  
</main>

<style>
  hr { 
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  .input {
    width: 15rem;
  }

  .input li, 
  .input div {
    display: flex;
    justify-content: space-around;
  }

</style>
