<script lang="ts">
  import { DateTime, type DayNumbers, type WeekdayNumbers } from 'luxon';
  import type { Occupation, OccupationType } from '$lib/types/occupations.js';
  import type { WeekdayLabels, MonthLabels, I18n } from '$lib/types/i18n.js';
  

  /** I18n ... monnth and weekday labels */
  export const defaultWeekdayLabels:WeekdayLabels = {
    1: 'Mo',
    2: 'Tu',
    3: 'We',
    4: 'Th',
    5: 'Fr',
    6: 'Sa',
    7: 'Su'
  }
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
  export const defaultMonthHeaderFormatFun = ( monthLabel:string, year:string ) => `${monthLabel} / ${year}`

  export let i18n:I18n = {
    weekdayLabels: defaultWeekdayLabels,
    monthLabels: defaultMonthLabels,
    monthHeaderFormatFun: defaultMonthHeaderFormatFun,
  }

  const monthHeader = ( m:DateTime ) => {
    let monthLabel = defaultMonthLabels[m.month];
    if (i18n?.monthLabels) {
      const custMonthLabel = i18n.monthLabels[m.month];
      if(!!custMonthLabel) monthLabel = custMonthLabel;
    }
  
    let formatFun = defaultMonthHeaderFormatFun;
    if (i18n.monthHeaderFormatFun) {
      formatFun = i18n.monthHeaderFormatFun
    }

    return formatFun(monthLabel, `${year}`)
  }

  const weekdayHeader = ( dayNum:WeekdayNumbers ):string => {
    let weekdayLabel = defaultWeekdayLabels[dayNum];
    if (i18n?.weekdayLabels) {
      weekdayLabel = i18n.weekdayLabels[dayNum];
    }
    return weekdayLabel;
  } 
  /** I18n ... end */

  /** Occupation Types configuration */
  export let defaultOccupationType: OccupationType = {
    name: 'default',
    backgroundColor: 'black',
    fontColor: 'white',
  }

  /** Occupation Types ... end */


  export let year = DateTime.now().year
  export let firstMonth = DateTime.now().month

  // 1 => Monday; always Monday. Don't overcomplicate things
  //export let firstDayOfWeek = 1;
  export let numberOfMonth = 12;
  export let occupations:Occupation[] = [];
  
  let months:DateTime[] = [];
  $: {
    let fMonth = DateTime.utc(year, firstMonth, 1)
    months.push(fMonth);
    
    let nMonth = fMonth.plus({months: 1})
    for (let c = 1; c < numberOfMonth; c++) {
      months.push(nMonth);
      nMonth = nMonth.plus({months: 1})
    }
  }

  let monthGridTemplateColumns = `[rowLegend] 1fr [d1] 1fr [d2] 1fr [d3] 1fr [d4] 1fr [d5] 1fr [d6] 1fr [d7] 1fr` 
  
  let monthGridTemplateRows = (m:DateTime):string => {
    let res = `[columnLegend] 1fr [w${m.weekNumber}] 1fr` 
    let n = m.plus({weeks: 1})
    for(let w = 1; w <= 5; w++) {
      res += ` [w${n.weekNumber}] 1fr`
      n = n.plus({weeks: 1})
    }
    return res
  }

  const weeks = (m:DateTime):DateTime[] => {
    let n = m.plus({weeks: 1});
    let res:DateTime[] = [m, n];
    for(let i = 1; i <= 4; i++) {
      n = n.plus({weeks: 1})
      res.push(n)
    }
    return res
  }

  const days = ( m:DateTime ):DateTime[] => {

    //find first
    let firstDay = m.startOf("week")

    //find last
    let lastDayOfMonth = m.endOf("month");
    let lastDay = lastDayOfMonth.endOf("week");

    let n = firstDay.plus({days: 1})
    let res:DateTime[] = [firstDay]
    
    while (n <= lastDay) {
      res.push(n)
      n = n.plus({days: 1})
    }

    return res
  }

  const hiddenWeekNum = ( m:DateTime, w:DateTime):boolean => {
    let lastDayOfMonth = m.endOf('month')
    let firstDayOfWeek = w.startOf('week');
    return lastDayOfMonth < firstDayOfWeek
  }

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

  const occupationBackground = (d:DateTime):string => {
    const o = occupied(d) 
    const oStarts = occupationStarts(d);
    const oEnds = occupationEnds(d);
    
    if(o || (oStarts && oEnds)) {
      let occ = o ?? oStarts;
      let t = defaultOccupationType
      if(occ?.type) {
        t = occ.type;
      }
      return `
        background-color: ${t.backgroundColor};
        color: ${t.fontColor};
      `
    }
    
    if(oStarts) {
      let t = defaultOccupationType
      if(oStarts.type) {
        t = oStarts.type;
      }
      return `background: linear-gradient(90deg, transparent, ${t.backgroundColor});`
    }

    if(oEnds) {
      let t = defaultOccupationType
      if(oEnds.type) {
        t = oEnds.type;
      }
      return `background: linear-gradient(90deg, ${t.backgroundColor}, transparent);`
    }

    return 'background-color: white;'
  }

</script>


<section class="occuplan-wrapper">
  <header>header</header>
  <main>
    {#each months as m ( `${m.year}-${m.month}` )}
    <div class="month">
      <header class="month-header">{ monthHeader(m) }</header>
      <div
        style="
            grid-template-columns: {monthGridTemplateColumns};
            grid-template-rows: {monthGridTemplateRows(m)};
          " 
        class="days">
          <div class="weekday-header" style="grid-area: columnLegend / d1 / columnLegend / d1;">{weekdayHeader(1)}</div>
          <div class="weekday-header" style="grid-area: columnLegend / d2 / columnLegend / d2;">{weekdayHeader(2)}</div>
          <div class="weekday-header" style="grid-area: columnLegend / d3 / columnLegend / d3;">{weekdayHeader(3)}</div>
          <div class="weekday-header" style="grid-area: columnLegend / d4 / columnLegend / d4;">{weekdayHeader(4)}</div>
          <div class="weekday-header" style="grid-area: columnLegend / d5 / columnLegend / d5;">{weekdayHeader(5)}</div>
          <div class="weekday-header" style="grid-area: columnLegend / d6 / columnLegend / d6;">{weekdayHeader(6)}</div>
          <div class="weekday-header" style="grid-area: columnLegend / d7 / columnLegend / d7;">{weekdayHeader(7)}</div>
          
          {#each days(m) as d ( `${d.year}-${d.month}-${d.day}` )}
          <div 
              class:weekend={ [6,7].includes(d.weekday) }
              class="day"
              style="
                grid-area: w{d.weekNumber} / d{d.weekday} / w{d.weekNumber} / d{d.weekday};
                {occupationBackground(d)}
                "
            >
            {d.day}
          </div>
          {/each}

          {#each weeks(m) as w ( `${w.year}-${w.month}-${w.weekNumber}` )}
          <div
              class:hidden={ hiddenWeekNum(m, w)}
              class="week-number"
              style="grid-area: w{w.weekNumber} / rowLegend / w{w.weekNumber} / rowLegend;"
            >
            {w.weekNumber}
          </div>
          {/each}
      </div>
    </div>
    {/each}
  </main>
  <footer>footer</footer>
</section>

<style>
  
  .hidden {
    display: none;
  }

  .week-number {
    text-align: left;
    font-style: italic;
    font-weight: lighter;
    color: grey;
  }

  .weekday-header {
    text-align: center;
    background-color: darkslategray;
    color: aliceblue;
  }

  .day {
    text-align: center;
  }

  .weekend {
    font-weight: bold;
  }

  .occuplan-wrapper {
    border: 1px solid black;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }

  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
    width: 100%;
  }

  .month {
    display: flex;
    flex-direction: column;
  }

  .days {
    display: grid;
  }

</style>