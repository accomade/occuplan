<script>import { DateTime } from "luxon";
import * as Sqrl from "squirrelly";
export const defaultWeekdayLabels = {
  1: "Mo",
  2: "Tu",
  3: "We",
  4: "Th",
  5: "Fr",
  6: "Sa",
  7: "Su"
};
export const defaultMonthLabels = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec"
};
export const defaultMonthHeaderFormat = "{{month}} / {{year}}";
export let i18n = {
  weekdayLabels: defaultWeekdayLabels,
  monthLabels: defaultMonthLabels,
  monthHeaderFormat: defaultMonthHeaderFormat,
  typeNames: {
    defaultOccupationTypeName: "occupied"
  }
};
$:
  monthHeader = (m) => {
    let monthLabel = defaultMonthLabels[m.month];
    if (i18n?.monthLabels) {
      const custMonthLabel = i18n.monthLabels[m.month];
      if (!!custMonthLabel)
        monthLabel = custMonthLabel;
    }
    let format = defaultMonthHeaderFormat;
    if (i18n.monthHeaderFormat) {
      format = i18n.monthHeaderFormat;
    }
    const formatFun = Sqrl.compile(format, { useWith: true });
    return formatFun({
      month: monthLabel,
      year: `${m.year}`
    }, Sqrl.defaultConfig);
  };
$:
  weekdayHeader = (dayNum) => {
    let weekdayLabel = defaultWeekdayLabels[dayNum];
    if (i18n?.weekdayLabels) {
      weekdayLabel = i18n.weekdayLabels[dayNum];
    }
    return weekdayLabel;
  };
export let defaultOccupationType = {
  name: "defaultOccupationTypeName",
  backgroundColor: "rgb(33, 158, 188)",
  fontColor: "rgb(2, 48, 71)"
};
let occupationTypes = [defaultOccupationType];
const addType = (t) => {
  const found = occupationTypes.find((et) => et.name === t.name);
  if (!found) {
    occupationTypes = [...occupationTypes, t];
  }
};
export let mainBorder = "1px solid rgb(2, 48, 71)";
export let gridBorder = "0.2px solid rgba(2, 48, 71, 0.2)";
export let fontColorMain = "rgb(2, 48, 71)";
export let fontColorDays = "rgb(2, 48, 71)";
export let fontColorDayHeaders = "rgb(2, 48, 71)";
export let fontColorWeekNum = "rgba(2, 48, 71, 0.5)";
export let backgroundColorDayHeaders = "rgb(142, 202, 230)";
export let backgroundColorWeeknum = "transparent";
export let backgroundColorMain = "transparent";
export let backgroundColorInvalidDays = "rgba(110,110,110,0.6)";
export let buttonStyle = `
    background-color: ${backgroundColorMain};
    padding: 0.2rem;
    border: 1px solid ${fontColorMain};
    border-radius: 0.5rem;
    filter: drop-shadow(0 0 0.2rem ${fontColorMain});
  `;
export let headerContent = "occupation plan";
export let footerContent = `
    <a 
        style="color: ${fontColorMain}; filter: opacity(0.3);"
        href="https://github.com/accomade/occuplan" 
        target="_blank">
      Occuplan is OSS
    </a>`;
export let year = DateTime.now().year;
export let maxYear = DateTime.local(year).plus({ years: 2 }).year;
export let minYear = year;
export let firstMonth = DateTime.now().month;
export let numberOfMonth = 12;
$:
  prevYear = DateTime.local(year).minus({ years: 1 }).year;
$:
  nextYear = DateTime.local(year).plus({ years: 1 }).year;
let months = [];
$: {
  let fMonth = DateTime.utc(year, firstMonth, 1);
  months = [fMonth];
  let nMonth = fMonth.plus({ months: 1 });
  for (let c = 1; c < numberOfMonth; c++) {
    months.push(nMonth);
    nMonth = nMonth.plus({ months: 1 });
  }
}
const nextYearClicked = () => {
  prevYear = year;
  year = nextYear;
  nextYear++;
};
const prevYearClicked = () => {
  nextYear = year;
  year = prevYear;
  prevYear--;
};
let monthGridTemplateColumns = `[rowLegend] 1fr [d1] 1fr [d2] 1fr [d3] 1fr [d4] 1fr [d5] 1fr [d6] 1fr [d7] 1fr`;
let monthGridTemplateRows = (m) => {
  let res = `[columnLegend] 1fr [w${m.weekNumber}] 1fr`;
  let n = m.plus({ weeks: 1 });
  for (let w = 1; w <= 5; w++) {
    res += ` [w${n.weekNumber}] 1fr`;
    n = n.plus({ weeks: 1 });
  }
  return res;
};
const weeks = (m) => {
  let n = m.plus({ weeks: 1 });
  let res = [m, n];
  for (let i = 1; i <= 4; i++) {
    n = n.plus({ weeks: 1 });
    res.push(n);
  }
  return res;
};
const days = (m) => {
  let firstDay = m.startOf("week");
  let lastDayOfMonth = m.endOf("month");
  let lastDay = lastDayOfMonth.endOf("week");
  let n = firstDay.plus({ days: 1 });
  let res = [firstDay];
  while (n <= lastDay) {
    res.push(n);
    n = n.plus({ days: 1 });
  }
  return res;
};
const hiddenWeekNum = (m, w) => {
  let lastDayOfMonth = m.endOf("month");
  let firstDayOfWeek = w.startOf("week");
  return lastDayOfMonth < firstDayOfWeek;
};
const today = DateTime.now();
const validDay = (d) => {
  return d > today;
};
export let occupations = [];
const occupied = (d, occupations2) => {
  const startOfDay = d.startOf("day");
  const endOfDay = d.endOf("day");
  return occupations2.find((o) => o.arrival < startOfDay && o.leave > endOfDay);
};
const occupationStarts = (d, occupations2) => {
  const startOfDay = d.startOf("day");
  const endOfDay = d.endOf("day");
  return occupations2.find((o) => o.arrival > startOfDay && o.arrival < endOfDay);
};
const occupationEnds = (d, occupations2) => {
  const startOfDay = d.startOf("day");
  const endOfDay = d.endOf("day");
  return occupations2.find((o) => o.leave > startOfDay && o.leave < endOfDay);
};
const occupationStyle = (d, m, occupations2) => {
  const valid = validDay(d);
  if (!valid) {
    return `
      color: ${backgroundColorInvalidDays};
      opacity: 0.3;
      background-color: ${backgroundColorInvalidDays};
        `;
  }
  const o = occupied(d, occupations2);
  const oStarts = occupationStarts(d, occupations2);
  const oEnds = occupationEnds(d, occupations2);
  const otherMonth = d.month !== m.month;
  if (o) {
    let t = defaultOccupationType;
    if (o?.type) {
      t = o.type;
      addType(t);
    }
    if (otherMonth) {
      return `
          background-color: ${t.backgroundColor};
          color: ${t.fontColor};
          opacity: 0.3;
        `;
    }
    return `
        background-color: ${t.backgroundColor};
        color: ${t.fontColor};
      `;
  }
  if (oEnds && oStarts) {
    let endType = defaultOccupationType;
    if (oEnds.type) {
      endType = oEnds.type;
      addType(endType);
    }
    let startType = defaultOccupationType;
    if (oStarts.type) {
      startType = oStarts.type;
      addType(startType);
    }
    if (otherMonth) {
      return `
        background: linear-gradient(90deg, ${endType.backgroundColor}, ${startType.backgroundColor});
        color: ${fontColorDays};
        opacity: 0.3;
        `;
    }
    return `
        background: linear-gradient(90deg, ${endType.backgroundColor}, ${startType.backgroundColor});
        color: ${fontColorDays};
        `;
  }
  if (oStarts) {
    let t = defaultOccupationType;
    if (oStarts.type) {
      t = oStarts.type;
      addType(t);
    }
    if (otherMonth) {
      return `
        background: linear-gradient(90deg, ${backgroundColorMain}, ${t.backgroundColor});
        color: ${fontColorDays};
        opacity: 0.3;
        `;
    }
    return `
        background: linear-gradient(90deg, ${backgroundColorMain}, ${t.backgroundColor});
        color: ${fontColorDays};
        `;
  }
  if (oEnds) {
    let t = defaultOccupationType;
    if (oEnds.type) {
      t = oEnds.type;
      addType(t);
    }
    if (otherMonth) {
      return `
        background: linear-gradient(90deg, ${t.backgroundColor}, ${backgroundColorMain});
        color: ${fontColorDays};
        opacity: 0.3;
        `;
    }
    return `
        background: linear-gradient(90deg, ${t.backgroundColor}, ${backgroundColorMain});
        color: ${fontColorDays};
        `;
  }
  if (otherMonth) {
    return `
      background-color: ${backgroundColorMain};
      color: ${fontColorDays};
      opacity: 0.3;
      `;
  }
  return `
      background-color: ${backgroundColorMain};
      color: ${fontColorDays};
      `;
};
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
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d1 / columnLegend / d1;">{weekdayHeader(1)}</div>
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d2 / columnLegend / d2;">{weekdayHeader(2)}</div>
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d3 / columnLegend / d3;">{weekdayHeader(3)}</div>
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d4 / columnLegend / d4;">{weekdayHeader(4)}</div>
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d5 / columnLegend / d5;">{weekdayHeader(5)}</div>
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d6 / columnLegend / d6;">{weekdayHeader(6)}</div>
          <div class="weekday-header" style="
            background-color: {backgroundColorDayHeaders};
            color: {fontColorDayHeaders};
            grid-area: columnLegend / d7 / columnLegend / d7;">{weekdayHeader(7)}</div>
          
          {#each days(m) as d ( `${d.year}-${d.month}-${d.day}` )}
          <div 
              class:weekend={ [6,7].includes(d.weekday) }
              class:other-month={ m.month !== d.month }
              class="day"
              style="
                grid-area: w{d.weekNumber} / d{d.weekday} / w{d.weekNumber} / d{d.weekday};
                {occupationStyle(d, m, occupations)}
                "
            >
            {d.day}
          </div>
          {/each}

          {#each weeks(m) as w ( `${w.year}-${w.month}-${w.weekNumber}` )}
          <div
              class:hidden={ hiddenWeekNum(m, w)}
              class="week-number"
              style="
                background-color: {backgroundColorWeeknum};
                color: {fontColorWeekNum};    
                grid-area: w{w.weekNumber} / rowLegend / w{w.weekNumber} / rowLegend;"
            >
            {w.weekNumber}
          </div>
          {/each}
      </div>
    </div>
    {/each}
  </main>
  <footer>
    <div class="legend">
      {#each occupationTypes as t}
        <label for="occupation-type-{t.name}-legend">{ i18n.typeNames ? i18n.typeNames[t.name] : t.name}</label>
        <div 
            id="occupation-type-{t.name}-legend"
            class="legend-entry-marker"
            style="
              background-color: {t.backgroundColor};
              outline: {gridBorder};
              ">
          &nbsp;
        </div>
      {/each}
    </div> 
    <div class="footer-content">
      {@html footerContent}
    </div>
  </footer>
</section>

<style>
  .footer-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .month-header {
    text-align: center;
  }
  
  .hidden {
    display: none;
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
    font-variant: small-caps;
  }

  .week-number {
    text-align: left;
    font-style: italic;
    font-weight: lighter;
  }

  .weekday-header {
    text-align: center;
   }

  .day {
    text-align: center;
  }

  .weekend {
    font-weight: bold;
  }

  .occuplan-wrapper {
    height: 100%;
    width: calc(100% - 0.5rem);
    padding: 0.5rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }

  main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
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

  footer {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
  }

  .legend {
    display: grid;
    grid-template-columns: [label] 1fr [marker] 1rem;
    column-gap: 1rem;
    text-transform: capitalize;
    font-variant: small-caps;
  }

</style>