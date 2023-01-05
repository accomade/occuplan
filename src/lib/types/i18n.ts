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
  weekendLabel?: string | undefined;
  weekdayLabels?: WeekdayLabels | undefined;
  monthLabels?: MonthLabels | undefined;
  monthHeaderFormatFun?: ((monthLabel: string, year: string) => string) | undefined;
}

export type { WeekdayLabels, MonthLabels, I18n}