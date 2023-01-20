<script lang="ts">
  import OccuPlanGrid from "./OccuPlanGrid.svelte";
  import OccuPlanRows from "./OccuPlanRows.svelte";

  import { getEvents } from '$lib/helpers/readICS';
  import type { Occupation } from "$lib/types/occupations";

  /**
   * Translations
  */
  export let translations = {
    weekdayLabels: {
      1: 'Mo',
      2: 'Di',
      3: 'Mi',
      4: 'Do',
      5: 'Fr',
      6: 'Sa',
      7: 'So'
    },
    monthLabels: {
      1: 'Jan',
      2: 'Feb',
      3: 'Mär',
      4: 'Apr',
      5: 'Mai',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sep',
      10: 'Okt',
      11: 'Nov',
      12: 'Dez',
    },
    monthHeaderFormatFun: ( monthLabel:string, year:string) => `${monthLabel} / ${year}`,
    weekendLabel: 'Wochenende'
  }

  export let defaultOccupationType = {
    name: 'Belegt',
    backgroundColor: 'rgb(33, 158, 188)',
    fontColor: 'rgb(2, 48, 71)',
  }
  /**
   * Styling
   */
  export let style = {
    mainBorder: '1px solid rgb(2, 48, 71)',
    gridBorder: '0.2px solid rgba(2, 48, 71, 0.2)',
    fontColorMain: 'rgb(2, 48, 71)',
    fontColorDays: 'rgb(2, 48, 71)',
    fontColorDayHeaders: 'rgb(2, 48, 71)',
    fontColorMonths: 'rgb(2, 48, 71)',
    fontColorWeekNum: 'rgba(2, 48, 71, 0.5)',
    backgroundHueWeekend: 'rgb(2, 48, 71)',
    backgroundColorDayHeaders: 'rgb(142, 202, 230)',
    backgroundColorWeeknum: 'transparent',
    backgroundColorMonths: 'rgb(142, 202, 230)',
    backgroundColorMain: 'transparent',
    backgroundColorInvalidDays: 'rgba(110,110,110,0.6)',
    buttonStyle: `
      background-color: transparent;
      border: 1px solid rgb(2, 48, 71);
      border-radius: 0.5rem;
      filter: drop-shadow(0 0 0.2rem rgb(2, 48, 71));
    `
  }

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
    err = '';
    if(!!calUrl) getEvents(url, eventsIncomingCallback).catch( (e) => {
      err = `${e}`;
    })
  }
  /*
    use different component based on different media size.
  */
	let w:Number;
	
</script>
{#if err}
<div class="error">
Error occured: {err}. <br>Check calendarURL: {calUrl}
</div>
{/if}

<div class="calendar-wrapper" bind:clientWidth={w}>
  {#if w > 640}
  <OccuPlanRows {occupations} {...style} i18n={translations} {defaultOccupationType}/>
  {:else}
  <OccuPlanGrid {occupations} {...style} i18n={translations} {defaultOccupationType}/>
  {/if}
</div>

<style>
  .calendar-wrapper {
    min-width: 210px;
    max-width: 820px;
  }
  .error {
    font-weight: bolder;
    color: darkred;
  }
</style>