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

  const days = ( m:DateTime ) => {

    //find first
    let firstDay = m.startOf("week")

    //find last
    let lastDayOfMonth = m.endOf("month");
    let lastDay = lastDayOfMonth.endOf("week");

    let n = firstDay.plus({days: 1})
    let res:DateTime[] = [firstDay]
    
    while (n <= lastDay) {
      console.log(n)
      res.push(n)
      n = n.plus({days: 1})
    }

    return res
  }

</script>


<section class="occuplan-wrapper">
  <header>header</header>
  <main>
    {#each months as m ( `${m.year}-${m.month}` )}
    <div class="month">
      <header class="month-header">{m.month} / {m.year}</header>
      <div class="days">
        <div>Mo</div>
        <div>Di</div>
        <div>Mi</div>
        <div>Do</div>
        <div>Fr</div>
        <div>Sa</div>
        <div>So</div>
        
        {#each days(m) as d ( `${d.year}-${d.month}-${d.day}` )}
        <div>{d.day}</div>
        {/each}
      </div>
    </div>
    {/each}
  </main>
  <footer>footer</footer>
</section>

<style>
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
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    
  }

</style>