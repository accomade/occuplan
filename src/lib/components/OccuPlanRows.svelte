<script lang="ts">

  import { DateTime, type DayNumbers, type WeekdayNumbers } from 'luxon';
  import type { Occupation, OccupationType } from '$lib/types/occupations.js';
  import type { I18n, MonthLabels } from '$lib/types/i18n.js';
  
  /** I18n month labels */
  
  export const defaultMonthLabels:MonthLabels = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  }

  export let i18n:I18n = {
    monthLabels: defaultMonthLabels,
  }

  const monthHeader = ( m:DateTime ) => {
    let monthLabel = defaultMonthLabels[m.month];
    if (i18n?.monthLabels) {
      const custMonthLabel = i18n.monthLabels[m.month];
      if(!!custMonthLabel) monthLabel = custMonthLabel;
    }
    return monthLabel
  }
  /** I18n end*/

  /** Styling */
  export let mainBorder = '1px solid rgb(2, 48, 71)';
  export let fontColorMain = 'rgb(2, 48, 71)';
  export let fontColorDays = 'rgb(2, 48, 71)';
  export let fontColorDayHeaders = 'rgb(2, 48, 71)';//'rgb(251, 133, 0)';
  export let fontColorMonths = 'rgba(2, 48, 71, 0.5)';
  
  export let backgroundColorDayHeaders = 'rgb(142, 202, 230)'//'rgb(33, 158, 188)';
  export let backgroundColorMonths = 'transparent';//'rgb(142, 202, 230)';
  export let backgroundColorMain = 'transparent';//'rgb(142, 202, 230)';
  
  export let buttonStyle = `
    background-color: ${backgroundColorMain};
    border: 1px solid ${fontColorMain};
    border-radius: 0.5rem;
    filter: drop-shadow(0 0 0.2rem ${fontColorMain});
  `
  /** Styling end */


  /** Header & Footer */
  export let headerContent = 'occupation plan';
  export let footerContent = `
    <a 
        style="color: ${fontColorMain}; filter: opacity(0.3);"
        href="https://github.com/accomade/occuplan" 
        target="_blank">
      Occuplan is OSS
    </a>`;
  /** Header & Footer end */
  

  /** Date calculations */
  export let year = DateTime.now().year
  export let maxYear = DateTime.local(year).plus({years: 2}).year
  export let minYear = year;

  export let firstMonth = DateTime.now().month

  // 1 => Monday; always Monday. Don't overcomplicate things
  //export let firstDayOfWeek = 1;
  export let numberOfMonth = 12;
  
  $: prevYear = DateTime.local(year).minus({years: 1}).year;
  $: nextYear = DateTime.local(year).plus({years: 1}).year;
  
  let months:DateTime[] = [];
  $: {
    
    
    let fMonth = DateTime.utc(year, firstMonth, 1)
    months = [fMonth];
    
    let nMonth = fMonth.plus({months: 1})
    for (let c = 1; c < numberOfMonth; c++) {
      months.push(nMonth);
      nMonth = nMonth.plus({months: 1})
    }
  }


  const nextYearClicked = () => {
    prevYear = year;
    year = nextYear;
    nextYear++;
  }

  const prevYearClicked = () => {
    nextYear = year;
    year = prevYear;
    prevYear--;
  }

  const monthDays = [...Array(31).keys()].map((i) => i+1);
  $:months = [...Array(numberOfMonth).keys()].map((n) => DateTime.local(year, firstMonth).plus({months: n}));
  
  let days:DateTime[];
  $: {
    days = []
    months.forEach( (m) => {
      let firstDayOfMonth = m.startOf("month")
      let lastDayOfMonth = m.endOf("month")
      let d = firstDayOfMonth;
      while(d < lastDayOfMonth) {
        days.push(d)
        d = d.plus({days: 1})
      }
    })
  }


  $:monthGridTemplateColumns = monthDays.reduce( (s, d) => {
      s += ` [d${d}] 1fr`;
      return s;
    }, '[rowLegend] 1fr');

  $:monthGridTemplateRows = months.reduce( (s, m) => {
    s += ` [m${m.month}y${m.year}] 1fr`;
    return s;
  }, '[columnLegend] 1fr');
  

  
  /** Date calculations end */


  /** Occupations */

  /** Occupation Types configuration */
  export let defaultOccupationType: OccupationType = {
    name: 'default',
    backgroundColor: 'rgb(33, 158, 188)',
    fontColor: 'rgb(2, 48, 71)',
  }
  /** Occupation Types ... end */


  export let occupations:Occupation[] = [];

  const occupied = ( d:DateTime ):Occupation|undefined => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    return occupations.find( (o) => o.arrival < startOfDay && o.leave > endOfDay)
  }

  const occupationStarts = ( d:DateTime ):Occupation|undefined => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    return occupations.find( (o) => o.arrival > startOfDay && o.arrival < endOfDay)
  }

  const occupationEnds = ( d:DateTime ):Occupation|undefined => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    return occupations.find( (o) => o.leave > startOfDay && o.leave < endOfDay)
  }

  const occupationStyle = (d:DateTime):string => {
    const o = occupied(d);
    const oStarts = occupationStarts(d);
    const oEnds = occupationEnds(d);
    
    if(o) {
      let t = defaultOccupationType
      if(o?.type) {
        t = o.type;
      }
      
      return `
        background-color: ${t.backgroundColor};
        color: ${t.fontColor};
      `
    }

    return `
      background-color: ${backgroundColorMain};
      color: ${fontColorDays};
      `
  }

  
  /** Occupations end*/

</script>

<section 
    style="
      border: {mainBorder};
      color: {fontColorMain};
      background-color: {backgroundColorMain};
    "
    class="occuplan-wrapper">
  <header class="occupation-plan-header">
    <div class="left-header-controls">
      {#if prevYear >= minYear}
        <button style={buttonStyle} on:click={prevYearClicked}>{prevYear}</button>
      {/if}
    </div>
    <div class="header-label">{@html headerContent}</div>
    <div class="right-header-controls">
      {#if nextYear <= maxYear}
        <button style={buttonStyle} on:click={nextYearClicked}>{nextYear}</button>
      {/if}
    </div>
  </header>
  <main style="
    grid-template-columns: {monthGridTemplateColumns};
    grid-template-rows: {monthGridTemplateRows};
    ">
    {#each monthDays as d}
      <div class="monthday-header" style="
        background-color: {backgroundColorDayHeaders};
        color: {fontColorDayHeaders};
        grid-area: columnLegend / d{d} / columnLegend / d{d};">{d}</div>
    {/each}

    {#each months as m ( `${m.year}-${m.month}` )}
      <div 
          class="month-label" 
          style="
            color: green;
            grid-area: m{m.month}y{m.year} / rowLegend / m{m.month}y{m.year} / rowLegend;">
        {monthHeader(m)}
      </div>
    {/each}

    {#each days as d ( `${d.year}-${d.month}-${d.day}` )}
      <div 
          class:weekend={ [6,7].includes(d.weekday) }
          class="day"
          style="
            grid-area: m{d.month}y{d.year}  / d{d.day} / m{d.month}y{d.year} / d{d.day};
            {occupationStyle(d)}
            "
        >
        {d.day}
      </div>
      {/each}
  </main>
  <footer>{@html footerContent}</footer>

</section>

<style>
  main {
    display: grid;
    width: 100%;
  }

  .monthday-header {
    text-align: center;
  }

  .occupation-plan-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .header-label {
    text-transform: capitalize;
    font-weight: bold;
  }

  .occuplan-wrapper {
    height: 100%;
    width: calc(100% -0.5rem);
    padding: 0.5rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }

  footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
  }

</style>