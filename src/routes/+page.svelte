<script lang="ts">
  import OccuPlanGrid from "../lib/components/OccuPlanGrid.svelte";
  import type { Occupation } from "$lib/types/occupations";
  import { DateTime } from "luxon";

  let occupations:Occupation[] = [
    {
      arrival: DateTime.now(),
      leave: DateTime.now().plus({weeks: 1}),
      type: "normal"
    },
    {
      arrival: DateTime.fromISO("2022-01-12"),
      leave: DateTime.fromISO("2022-02-12T13:00:00"),
      type: "normal"
    }
  ];

</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<main>
  <h2>GridExample</h2>
  <section>
    <OccuPlanGrid {occupations}/>
  </section>
</main>
