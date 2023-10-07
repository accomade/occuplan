<script lang="ts">
  import OccuPlanGrid from "./OccuPlanGrid.svelte";
  import OccuPlanRows from "./OccuPlanRows.svelte";

  import { getEvents } from '$lib/helpers/readICS';
  import type { Occupation } from "$lib/types/occupations";
  import type { I18n } from '$lib/types/i18n';
  import { onMount } from "svelte";
  /**
   * Translations
  */
  export let translations:I18n = {
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
    monthHeaderFormat: '{{month}} / {{year}}',
    weekendLabel: 'Wochenende',
    typeNames: {
      defaultOccupationTypeName: 'Belegt',
    }
  }

  export let defaultOccupationType = {
    name: 'defaultOccupationTypeName',
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
      padding: 0.2rem;
      border: 1px solid rgb(2, 48, 71);
      border-radius: 0.5rem;
      filter: drop-shadow(0 0 0.2rem rgb(2, 48, 71));
    `
  }

  /**
   * Header & Footer
   */

  export let headerContent = 'Belegung';
  export let footerContent = `
    <a 
        style="color: 'rgb(2, 48, 71)'; filter: opacity(0.3);"
        href="https://github.com/accomade/occuplan"
        rel="noreferrer"
        target="_blank">
      Occuplan is OSS
    </a>`;

  //e.g. https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics
  export let calUrl:string;
  $: encodedCalUrl = encodeURIComponent(calUrl)
  $: url = `https://ical-proxy.onrender.com/ical?url=${encodedCalUrl}`
  
  export let loading = false;
  let occupations:Occupation[] = []
  const eventsIncomingCallback = ( o:Occupation ) => {
    occupations = [...occupations, o]
    loading = false;
  }
  
  let initialLoadDone = false;
  onMount( () => {
    initialLoadDone = true;
  })

  let err = '';
  $: {
    err = '';
    if(!calUrl) loading = false;

    if(!!calUrl && initialLoadDone) { 
      loading = true;
      getEvents(url, eventsIncomingCallback).catch( (e) => {
        err = `${e}`;
      })
    }
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
  {#if w && w.valueOf() > 640}
  <OccuPlanRows {headerContent} {footerContent} {occupations} {...style} i18n={translations} {defaultOccupationType}/>
  {:else}
  <OccuPlanGrid {headerContent} {footerContent} {occupations} {...style} i18n={translations} {defaultOccupationType}/>
  {/if}
</div>

<style>
  .calendar-wrapper {
    min-width: 210px;
    max-width: 820px;
    width: 100%;
  }
  .error {
    font-weight: bolder;
    color: darkred;
  }
</style>