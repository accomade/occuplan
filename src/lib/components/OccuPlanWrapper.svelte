<script lang="ts">
  import OccuPlanGrid from "./OccuPlanGrid.svelte";
  import OccuPlanRows from "./OccuPlanRows.svelte";

  /*
    use different component based on different media size.
  */
	let w:Number;
	
</script>

<div bind:clientWidth={w}>
  {#if w < 640}
  <OccuPlanRows></OccuPlanRows>
  {:else}
  <OccuPlanGrid></OccuPlanGrid>
  {/if}
</div>

<style>


</style>