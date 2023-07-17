import { SvelteComponent } from "svelte";
import { DateTime } from 'luxon';
declare const __propDef: {
    props: {
        calUrl: string;
        search?: number[] | undefined;
        maxFutureDate?: DateTime | undefined;
        loading?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            available: {
                [key: number]: DateTime | null;
            };
        };
    };
};
export type OccuPlanAvailableInfoProps = typeof __propDef.props;
export type OccuPlanAvailableInfoEvents = typeof __propDef.events;
export type OccuPlanAvailableInfoSlots = typeof __propDef.slots;
export default class OccuPlanAvailableInfo extends SvelteComponent<OccuPlanAvailableInfoProps, OccuPlanAvailableInfoEvents, OccuPlanAvailableInfoSlots> {
}
export {};
