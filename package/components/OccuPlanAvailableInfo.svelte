<script>import { getEvents } from "../helpers/readICS";
import { DateTime } from "luxon";
import { onMount } from "svelte";
export let calUrl;
export let search = [3, 7, 14];
export let maxFutureDate = DateTime.now().plus({ years: 1 });
$:
  encodedCalUrl = encodeURIComponent(calUrl);
$:
  url = `https://ical-proxy.onrender.com/ical?url=${encodedCalUrl}`;
export let loading = false;
let occupations = [];
const eventsIncomingCallback = (o) => {
  occupations = [...occupations, o];
  loading = false;
};
let initialLoadDone = false;
onMount(() => {
  initialLoadDone = true;
});
let err = "";
$: {
  err = "";
  if (!!calUrl && initialLoadDone) {
    loading = true;
    getEvents(url, eventsIncomingCallback).catch((e) => {
      err = `${e}`;
    });
  }
}
let days = [];
$: {
  let firstDay = DateTime.now().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
  let n = firstDay;
  while (n <= maxFutureDate) {
    days.push(n);
    n = n.plus({ days: 1 });
  }
}
let av = {};
search.reduce(
  (acc, numberOfDays) => {
    av[numberOfDays] = null;
    return acc;
  },
  av
);
$: {
  if (occupations.length > 0) {
    let foundFirst = false;
    let firstDate;
    let consecutive = 0;
    for (const d of days) {
      if (notOccupied(d, occupations)) {
        if (!foundFirst) {
          foundFirst = true;
          firstDate = d;
        }
        consecutive++;
      } else {
        search.forEach((n) => {
          if (consecutive >= n && av[n] == null) {
            av[n] = firstDate;
          }
        });
        let foundAll = true;
        search.forEach((n) => {
          if (av[n] == null) {
            foundAll = false;
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
    };
  }
}
const notOccupied = (d, occupations2) => {
  const startOfDay = d.startOf("day");
  const endOfDay = d.endOf("day");
  for (const o of occupations2) {
    if (o.arrival < startOfDay && o.leave > endOfDay) {
      return false;
    }
  }
  return true;
};
</script>

<slot available={av}></slot>