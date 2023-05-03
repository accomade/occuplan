import { SvelteComponentTyped } from "svelte";
import type { Occupation, OccupationType } from '../types/occupations.js';
import type { WeekdayLabels, MonthLabels, I18n } from '../types/i18n.js';
declare const __propDef: {
    props: {
        /** I18n ... month and weekday labels */ defaultWeekdayLabels?: WeekdayLabels | undefined;
        defaultMonthLabels?: MonthLabels | undefined;
        defaultMonthHeaderFormatFun?: ((monthLabel: string, year: string) => string | Promise<string>) | undefined;
        i18n?: I18n | undefined;
        /** Occupation Types configuration */ defaultOccupationType?: OccupationType | undefined;
        /** Styling */ mainBorder?: string | undefined;
        gridBorder?: string | undefined;
        fontColorMain?: string | undefined;
        fontColorDays?: string | undefined;
        fontColorDayHeaders?: string | undefined;
        fontColorWeekNum?: string | undefined;
        backgroundColorDayHeaders?: string | undefined;
        backgroundColorWeeknum?: string | undefined;
        backgroundColorMain?: string | undefined;
        backgroundColorInvalidDays?: string | undefined;
        buttonStyle?: string | undefined;
        /** Hedear & Footer */ headerContent?: string | undefined;
        footerContent?: string | undefined;
        /** Date calculations */ year?: number | undefined;
        maxYear?: number | undefined;
        minYear?: number | undefined;
        firstMonth?: number | undefined;
        numberOfMonth?: number | undefined;
        /** Occupations */ occupations?: Occupation[] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type OccuPlanGridProps = typeof __propDef.props;
export type OccuPlanGridEvents = typeof __propDef.events;
export type OccuPlanGridSlots = typeof __propDef.slots;
export default class OccuPlanGrid extends SvelteComponentTyped<OccuPlanGridProps, OccuPlanGridEvents, OccuPlanGridSlots> {
    get defaultWeekdayLabels(): WeekdayLabels;
    get defaultMonthLabels(): MonthLabels;
    get defaultMonthHeaderFormatFun(): (monthLabel: string, year: string) => string | Promise<string>;
}
export {};
