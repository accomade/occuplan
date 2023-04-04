interface WeekdayLabels {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
}
interface MonthLabels {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
}
interface I18n {
    weekendLabel?: string;
    weekdayLabels?: WeekdayLabels;
    monthLabels?: MonthLabels;
    monthHeaderFormatFun?: ((monthLabel: string, year: string) => Promise<string> | string);
    typeNames?: {
        [key: string]: string;
    };
}
export type { WeekdayLabels, MonthLabels, I18n };
