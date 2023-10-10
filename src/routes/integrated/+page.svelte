<script lang="ts">
  import OccuPlanWrapper from '$lib/components/OccuPlanWrapper.svelte';


  //e.g. https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics
  
  let calUrl = ''
  let eventsLoading = false;
  let initial = true

  $: {
    if( !!calUrl ) {
      eventsLoading = true
      initial = false
    }
  }

  let errorMessage = ''
  let errorOccured = false;
  const fetchReturned = ( e:CustomEvent ) => {
    console.log(e)

    eventsLoading = false;
    errorOccured = e.detail.error;
    errorMessage = e.detail.message;
  }

  

</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main>
  <div>
    <h2>Insert CalendarURL</h2>
    <input name="url-entry" type="text" bind:value={calUrl} style="row-height=2rem;">
  </div>
  
  <h2>Calendar View</h2>
  <div style="margin-bottom: 2rem;">
    {#if errorOccured}
    <p class="error-message">Error: {errorMessage}</p>
    {:else if initial}
    Initial, enter or paste iCal URL
    {:else if eventsLoading}
    Loading Events! Hang tight!
    {:else}
    Displaying events from: {calUrl}
    {/if}
  </div>
  <OccuPlanWrapper on:result={fetchReturned} {calUrl}/>
</main>



<style>
  :global( button ) {
    background-color: wheat;
  }
  input[type=text] {
    line-height: 1.5rem;
    border: 2px solid darkred;
    width: 20rem;
  }
  .error-message {
    color: red;
    font-weight: bold;
  }
</style>