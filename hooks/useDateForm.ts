import React from "react";

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

interface DateProps {
  month: string;
  monthIndex: number;
  year: number;
  firstWeekDay: number;
  voidDays: number[];
  lastMonthDay: number;
  days: { day: number; selected?: boolean }[];
  weekDays: string[];
}

function getNumbersFromString(str: string): string {
  const res = str.replace(/\D/g, "");
  return res;
}

const getUTCDateProps = (date: Date, selectedDate: Date): DateProps => {
  const month = months[date.getUTCMonth()];
  const lastMonthDate = new Date(
    date.getUTCMonth() === 11
      ? date.getUTCFullYear() + 1
      : date.getUTCFullYear(),
    date.getUTCMonth() === 11 ? 0 : date.getUTCMonth() + 1,
    0
  );

  const firstMonthDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);

  const lastMonthDay = lastMonthDate.getUTCDate();

  const days = new Array(lastMonthDay).fill(1).map((d, i) => {
    return {
      day: d + i,
      selected:
        selectedDate &&
        selectedDate.getUTCFullYear() === date.getUTCFullYear() &&
        selectedDate.getUTCMonth() === date.getUTCMonth() &&
        selectedDate.getUTCDate() === d + i,
    };
  });

  return {
    days,
    lastMonthDay,
    firstWeekDay: firstMonthDate.getDay(),
    voidDays: new Array(firstMonthDate.getDay()).fill(0),
    month,
    monthIndex: date.getUTCMonth(),
    year: date.getUTCFullYear(),
    weekDays,
  };
};

const getPreviousMonthDate = (date: Date): Date => {
  const previousMonthDate = new Date(
    date.getUTCMonth() === 0
      ? date.getUTCFullYear() - 1
      : date.getUTCFullYear(),
    date.getUTCMonth() === 0 ? 11 : date.getUTCMonth() - 1,
    1
  );

  return previousMonthDate;
};

const getNextMonthDate = (date: Date): Date => {
  const nextMonthDate = new Date(
    date.getUTCMonth() === 11
      ? date.getUTCFullYear() + 1
      : date.getUTCFullYear(),
    date.getUTCMonth() === 11 ? 0 : date.getUTCMonth() + 1,
    1
  );

  return nextMonthDate;
};

const formatDayMonth = (dayOrMonth: number): string => {
  return `${dayOrMonth < 10 ? "0" : ""}${dayOrMonth.toString()}`;
};

const formatDateString = (date: Date): string => {
  return `${formatDayMonth(date.getUTCDate())}/${formatDayMonth(
    date.getUTCMonth() + 1
  )}/${formatDayMonth(date.getUTCFullYear())}`;
};

interface UseDateProps {
  onChange: (e) => void;
  onBlur: (e) => void;
  currentYear: number;
  dateProps: DateProps[];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  setNewDate: (day: number) => void;
}

const useDateForm = (
  value: string,
  setValue: (v: string) => void,
  defaultDate?: Date
): UseDateProps => {
  const [date, setDate] = React.useState<Date>(defaultDate ?? new Date());

  const getUTCDatePropsArray = (
    date: Date,
    selectedDate?: Date
  ): DateProps[] => {
    if (!date) {
      return null;
    }
    return [
      getUTCDateProps(getPreviousMonthDate(date), selectedDate),
      getUTCDateProps(date, selectedDate),
      getUTCDateProps(getNextMonthDate(date), selectedDate),
    ];
  };

  const [dateProps, setDateProps] = React.useState<DateProps[]>(
    date && getUTCDatePropsArray(date)
  );

  const getSelectedDateFromValue = (): Date => {
    const onlyNumbersDate = getNumbersFromString(value);
    const isoDate =
      onlyNumbersDate.length === 8
        ? `${onlyNumbersDate.substring(4)}-${onlyNumbersDate.substring(
            2,
            4
          )}-${onlyNumbersDate.substring(0, 2)}`
        : "";

    const selectedDate =
      onlyNumbersDate.length === 8 ? new Date(isoDate) : undefined;

    return selectedDate;
  };

  const goToNextMonth = () => {
    const nextMonth = getNextMonthDate(date);
    setDate(nextMonth);
    setDateProps(getUTCDatePropsArray(nextMonth, getSelectedDateFromValue()));
  };

  const goToPreviousMonth = () => {
    const previousMonth = getPreviousMonthDate(date);
    setDate(previousMonth);
    setDateProps(
      getUTCDatePropsArray(previousMonth, getSelectedDateFromValue())
    );
  };

  const getFormattedDate = (dateStr: string): string => {
    dateStr = getNumbersFromString(dateStr.substring(0, 10));
    dateStr =
      dateStr.length >= 3
        ? `${dateStr.substring(0, 2)}/${dateStr.substring(2)}`
        : dateStr;
    dateStr =
      dateStr.length >= 6
        ? `${dateStr.substring(0, 5)}/${dateStr.substring(5)}`
        : dateStr;

    return dateStr;
  };

  const setNewDate = (day: number) => {
    const isoDate = date.toISOString().substring(0, 8) + formatDayMonth(day);
    const localDate =
      isoDate.substring(8) + isoDate.substring(5, 7) + isoDate.substring(0, 4);
    setValue(getFormattedDate(isoDate));
    setDate(new Date(isoDate));
    setDateProps(getUTCDatePropsArray(new Date(isoDate), new Date(isoDate)));
    setValue(getFormattedDate(localDate));
  };

  const onChange = (e) => {
    const date = getFormattedDate(e.target.value);
    setValue(date);

    if (date.length === 10) {
      const onlyNumbersDate = getNumbersFromString(date);
      const isoDate = `${onlyNumbersDate.substring(
        4
      )}-${onlyNumbersDate.substring(2, 4)}-${onlyNumbersDate.substring(0, 2)}`;

      var timestamp = Date.parse(isoDate);

      if (isNaN(timestamp) == false) {
        setDate(new Date(timestamp));
        setDateProps(
          getUTCDatePropsArray(new Date(timestamp), new Date(timestamp))
        );
      } else {
        setValue("");
      }
    }
  };

  const onBlur = (e) => {
    const date = getNumbersFromString(e.target.value);
    const today = new Date();

    if (date.length === 1 || date.length === 2) {
      e.target.value = `${formatDayMonth(+date)}/${formatDayMonth(
        today.getUTCMonth() + 1
      )}/${today.getUTCFullYear()}`;
    } else if (date.length === 3 || date.length === 4) {
      e.target.value = `${date}/${today.getUTCFullYear()}`;
    }

    onChange(e);
  };

  return {
    onChange,
    currentYear: new Date().getUTCFullYear(),
    onBlur: onBlur,
    dateProps,
    goToPreviousMonth,
    goToNextMonth,
    setNewDate,
  };
};

export default useDateForm;
