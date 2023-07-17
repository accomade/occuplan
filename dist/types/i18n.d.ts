import type { MonthNumbers, WeekdayNumbers } from 'luxon';
type WeekdayLabels = {
    [key in WeekdayNumbers]: string;
};
type MonthLabels = {
    [key in MonthNumbers]: string;
};
interface I18n {
    weekendLabel?: string;
    weekdayLabels?: WeekdayLabels;
    monthLabels?: MonthLabels;
    monthHeaderFormat: string;
    typeNames?: {
        [key: string]: string;
    };
}
export type { WeekdayLabels, MonthLabels, I18n };
