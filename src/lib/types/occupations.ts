import type { DateTime } from "luxon";

interface Occupation {
  arrival: DateTime;
  leave: DateTime;
  type: string|undefined;
}

export type { Occupation }