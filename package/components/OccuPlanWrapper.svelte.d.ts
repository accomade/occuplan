import { SvelteComponentTyped } from "svelte";
import type { I18n } from '../types/i18n';
declare const __propDef: {
    props: {
        /**
           * Translations
          */ translations?: I18n | undefined;
        defaultOccupationType?: {
            name: string;
            backgroundColor: string;
            fontColor: string;
        } | undefined;
        /**
           * Styling
           */ style?: {
            mainBorder: string;
            gridBorder: string;
            fontColorMain: string;
            fontColorDays: string;
            fontColorDayHeaders: string;
            fontColorMonths: string;
            fontColorWeekNum: string;
            backgroundHueWeekend: string;
            backgroundColorDayHeaders: string;
            backgroundColorWeeknum: string;
            backgroundColorMonths: string;
            backgroundColorMain: string;
            backgroundColorInvalidDays: string;
            buttonStyle: string;
        } | undefined;
        /**
           * Header & Footer
           */ headerContent?: string | undefined;
        footerContent?: string | undefined;
        calUrl: string;
        loading?: boolean | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type OccuPlanWrapperProps = typeof __propDef.props;
export type OccuPlanWrapperEvents = typeof __propDef.events;
export type OccuPlanWrapperSlots = typeof __propDef.slots;
export default class OccuPlanWrapper extends SvelteComponentTyped<OccuPlanWrapperProps, OccuPlanWrapperEvents, OccuPlanWrapperSlots> {
}
export {};
