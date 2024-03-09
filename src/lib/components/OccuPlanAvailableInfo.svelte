<script lang="ts">
  import { debounce } from '$lib/helpers/debounce';
  import { getEvents, type GetEventsResult } from '$lib/helpers/readICS';
  import type { Occupation } from "$lib/types/occupations";
  import { DateTime } from 'luxon';
  
  import { createEventDispatcher } from 'svelte';
  
  const dispatchFetchResult = createEventDispatcher<{result: GetEventsResult}>()
  
  interface AvailableSpans {
    [key:number]: DateTime | null;
  }

  export let search = [3, 7, 14];
  export let maxFutureDate = DateTime.utc().plus({years: 1}).set({hour: 12, minute: 0, second: 0, millisecond: 0})
  export let calUrl:string;
  export let missingCalUrlMessage = "Missing iCal URL, availability can not be calculated."
  export let id = crypto.randomUUID();
  
  let occupiedDays:Record<string,boolean> = {}
  const eventsIncomingCallback = ( o:Occupation ) => {  
    let startDate = o.arrival;
    let endDate = o.leave;

    if(o.arrival > o.leave) {
      startDate = o.leave
      endDate = o.arrival
    }

    let cDate = startDate;
    while( cDate < endDate ) {
      const key = `${cDate.year}-${cDate.month}-${cDate.day}`
      occupiedDays[key] = true

      occupiedDays = occupiedDays;
      cDate = cDate.plus({days: 1})
    }

    calcAvailability()
  }

  $: {
    if(search && search.length > 0) {
      calcAvailability()
    }
  }

  let av:AvailableSpans = search.reduce(( acc, num ) => { acc[num] = null; return acc }, {} as AvailableSpans)
  const calcAvailability = () => {
    av = search.reduce(( acc, num ) => { acc[num] = null; return acc }, {} as AvailableSpans)

    let foundFirst = false;
    let firstDate:DateTime;
    let consecutive = 0;

    for(const d of days) {

      const key = `${d.year}-${d.month}-${d.day}`
      if( occupiedDays[key] ) {
        foundFirst = false;
        consecutive = 0;
      } else {
        if(foundFirst) {
          consecutive++;
          
          search.forEach( (n) => {
            if(consecutive >= n && av[n] == null) {
              av[n] = firstDate;
            }
          })

          let foundAll = true;
          search.forEach( (num) => {
            if( !av[num] ) {
              foundAll = false;
            }          
          })

          if(foundAll) break;
        }
        else {
          foundFirst = true
          firstDate = d;
        }
      }
    }
  }
  
  $: {
    if(!calUrl) {
      dispatchFetchResult('result', {
        code: 400,
        message: 'Empty calUrl',
        error: true
      });
    }

    if(!!calUrl) { 
      debounce(id, async ():Promise<boolean> => {
        const eventsResult = await getEvents(
          calUrl, eventsIncomingCallback )

        //console.log(JSON.stringify( eventsResult, null, 2 ))
        dispatchFetchResult('result', eventsResult);
        return !eventsResult.error
      }, {initialDelay: 200, debounceDelay: 5000})
    }
  }

  let days:DateTime[] = [];
  $: {
    let firstDay = DateTime.utc().set({hour: 12, minute: 0, second: 0, millisecond: 0})
    
    let n = firstDay
    while (n <= maxFutureDate) {
      days.push(n)
      n = n.plus({days: 1})
    }

    days = [...days]
  }


</script>

{#if !!calUrl}
  <slot available={av}></slot>
{:else}
  <div class="missing-cal-url">{missingCalUrlMessage}</div>
{/if}

<style>
  .missing-cal-url {
    font-size: 1.2rem;
    font-weight: bold;
    color: darkred;
  }
</style>