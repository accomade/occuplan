<script lang="ts">
  import { DateTime } from 'luxon';
  import type { Occupation } from '$lib/types/occupations.js';
  
  export let year = DateTime.now().get("year")
  export let firstMonth = 1;

  // 1 => Monday; always Monday. Don't overcomplicate things
  //export let firstDayOfWeek = 1;
  export let numberOfMonth = 12;
  export let occupations:Occupation[] = [];
  
  let months:DateTime[] = [];
  $: {
    let c = 0;
    for (let i = firstMonth; i <= numberOfMonth; i++) {
      months[c] = DateTime.utc(year, i, 1)
      c++;
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

  const occupied = ( d:DateTime ):boolean => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    return !! occupations.find( (o) => o.arrival < startOfDay && o.leave > endOfDay)
  }

  const occupationStarts = ( d:DateTime ):boolean => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    return !! occupations.find( (o) => o.arrival > startOfDay && o.arrival < endOfDay)
  }

  const occupationEnds = ( d:DateTime ):boolean => {
    const startOfDay = d.startOf('day');
    const endOfDay = d.endOf('day')
    return !! occupations.find( (o) => o.leave > startOfDay && o.leave < endOfDay)
  }

</script>


<section class="occuplan-wrapper">
  <header>header</header>
  <main>
    {#each months as m ( `${m.year}-${m.month}` )}
    <div class="month">
      <header class="month-header">{m.month} / {m.year}</header>
      <div
        style="
            grid-template-columns: {monthGridTemplateColumns};
            grid-template-rows: {monthGridTemplateRows(m)};
          " 
        class="days">
          <div class="weekday-header" style="grid-area: columnLegend / d1 / columnLegend / d1;">Mo</div>
          <div class="weekday-header" style="grid-area: columnLegend / d2 / columnLegend / d2;">Di</div>
          <div class="weekday-header" style="grid-area: columnLegend / d3 / columnLegend / d3;">Mi</div>
          <div class="weekday-header" style="grid-area: columnLegend / d4 / columnLegend / d4;">Do</div>
          <div class="weekday-header" style="grid-area: columnLegend / d5 / columnLegend / d5;">Fr</div>
          <div class="weekday-header" style="grid-area: columnLegend / d6 / columnLegend / d6;">Sa</div>
          <div class="weekday-header" style="grid-area: columnLegend / d7 / columnLegend / d7;">So</div>
          
          {#each days(m) as d ( `${d.year}-${d.month}-${d.day}` )}
          <div 
              class:occupied={ occupied(d) }
              class:occupationStarts={ occupationStarts(d) }
              class:occupationEnds={ occupationEnds(d) }
              class:weekend={ [6,7].includes(d.weekday) }
              class="day"
              style="grid-area: w{d.weekNumber} / d{d.weekday} / w{d.weekNumber} / d{d.weekday};"
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
  .occupationStarts {
    background: linear-gradient(90deg, transparent, black);
  }
  .occupationEnds {
    background: linear-gradient(90deg, black, transparent);
  }
  .occupied {
    background-color: black;
    color: darkolivegreen;
  }

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