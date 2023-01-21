# OccuPlan

OccuPlan consists of two calendar components (a grid view and a month-rows view) and a third components that wraps both to provide some responsiveness. And switches between the two views based on the container size.

Each can be embedded into your website.

The wrapper has an additional functionality. It let's you define an calUrl. Which you can point to an iCal file. The events in this file will be displayed in the calendar views.

# Usage

```svelte
<script>
import { OccuPlanWrapper } from 'occuplan'
</script>

<OccuPlanWrapper calUrl="YOUR_ICAL_PUBLIC_URL">


```



# License

MIT ... see license file