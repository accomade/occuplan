import { SvelteComponentTyped } from "svelte";
import type { Occupation, OccupationType } from '../types/occupations.js';
import type { I18n, MonthLabels } from '../types/i18n.js';
declare const __propDef: {
    props: {
        /** I18n month labels */ defaultMonthLabels?: MonthLabels | undefined;
        defaultWeekendLabel?: string | undefined;
        i18n?: I18n | undefined;
        /** Styling */ mainBorder?: string | undefined;
        gridBorder?: string | undefined;
        fontColorMain?: string | undefined;
        fontColorDayHeaders?: string | undefined;
        fontColorMonths?: string | undefined;
        backgroundHueWeekend?: string | undefined;
        backgroundColorDayHeaders?: string | undefined;
        backgroundColorMonths?: string | undefined;
        backgroundColorMain?: string | undefined;
        backgroundColorInvalidDays?: string | undefined;
        buttonStyle?: string | undefined;
        /** Header & Footer */ headerContent?: string | undefined;
        footerContent?: string | undefined;
        /** Date calculations */ year?: number | undefined;
        maxYear?: number | undefined;
        minYear?: number | undefined;
        firstMonth?: number | undefined;
        numberOfMonth?: number | undefined;
        /** Occupation Types configuration */ defaultOccupationType?: OccupationType | undefined;
        /** Occupation Types ... end */ occupations?: Occupation[] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type OccuPlanRowsProps = typeof __propDef.props;
export type OccuPlanRowsEvents = typeof __propDef.events;
export type OccuPlanRowsSlots = typeof __propDef.slots;
export default class OccuPlanRows extends SvelteComponentTyped<OccuPlanRowsProps, OccuPlanRowsEvents, OccuPlanRowsSlots> {
    get defaultMonthLabels(): MonthLabels;
    get defaultWeekendLabel(): string;
}
export {};
