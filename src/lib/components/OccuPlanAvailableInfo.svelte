<script lang="ts">
  import { debounce } from '$lib/helpers/debounce';
  import { getEvents, type GetEventsResult } from '$lib/helpers/readICS';
  import type { Occupation } from "$lib/types/occupations";
  import { DateTime } from 'luxon';
  import { onMount } from 'svelte';
  
  import { createEventDispatcher } from 'svelte';
  
  const dispatchFetchResult = createEventDispatcher<{result: GetEventsResult}>()
  
  export let calUrl:string;
  export let search = [3, 7, 14];
  export let maxFutureDate = DateTime.now().plus({years: 1})


  $: encodedCalUrl = encodeURIComponent(calUrl)
  $: url = `https://ical-proxy.onrender.com/ical?url=${encodedCalUrl}`
  
  export let loading = false;
  export let id = crypto.randomUUID();
  
  let occupations:Occupation[] = []
  const eventsIncomingCallback = ( o:Occupation ) => {
    occupations = [...occupations, o]
    loading = false;
  }
  
  let initialLoadDone = false;
  onMount( () => {
    initialLoadDone = true;
  })

  $: {
    if(!calUrl) loading = false;

    if(!!calUrl && initialLoadDone) { 
      loading = true;
      debounce(id, async ():Promise<boolean> => {
        const eventsResult = await getEvents(
          url, eventsIncomingCallback )
        
        dispatchFetchResult('result', eventsResult);
  
        if(eventsResult.error) {
          return false;
        }

        return true
      }, {initialDelay: 200, debounceDelay: 5000})
    }
  }

  let days:DateTime[] = [];
  $: {
    let firstDay = DateTime.now().set({hour: 12, minute: 0, second: 0, millisecond: 0})
    let n = firstDay
    while (n <= maxFutureDate) {
      days.push(n)
      n = n.plus({days: 1})
    }
  }

  
  interface AvailableSpans {
    [key:number]: DateTime | null;
  }

  let av:AvailableSpans = {}
  search.reduce((acc, numberOfDays) => {
      av[numberOfDays] = null;
      return acc
    }
    , av);

  $: {
    if(occupations.length > 0) {

      let foundFirst = false;
      let firstDate:DateTime;
      let consecutive = 0;

      for(const d of days) {
        if( notOccupied(d, occupations) ){
          if (!foundFirst) {
            foundFirst = true;
            firstDate = d;
          }
          consecutive++
        }
        else {
          search.forEach( (n) => {
            if(consecutive >= n && av[n] == null) {
              av[n] = firstDate;
              //console.log(n, firstDate);
            }
          })

          //found all?
          let foundAll = true;
          search.forEach( (n) => {
            if(av[n] == null) {
              foundAll = false
            }
          });
          if (foundAll) {
            break;
          }

          consecutive = 0;
          foundFirst = false;
        }
      }

      av = {
        ...av
      }
    }
  }

  const notOccupied = ( d:DateTime, occupations:Occupation[] ):boolean => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    
    for (const o of occupations) {
      if(o.arrival < startOfDay && o.leave > endOfDay) {
        return false
      }
    }
    return true;
    //return !occupations.find( (o) => o.arrival < startOfDay && o.leave > endOfDay)
  }

</script>

<slot available={av}></slot>