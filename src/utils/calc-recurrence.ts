import { DateTime, Interval } from "luxon";

import { RecurReqEnum } from "../models/todo";

const calculateRecurrence = (dueDate: string, recurInteger: string, recurInterval: string) => {
  const now = DateTime.now();
  switch (recurInterval) {
    case RecurReqEnum.d:
    case RecurReqEnum.ds: {
      // could add a recursive function here to find the next relevant recurrence date if the current date has expired
      const testDate = DateTime.fromISO(dueDate).plus({ days: Number(recurInteger) });
      if (DateTime.now() > testDate) {
        const i = Interval.fromDateTimes(testDate, now);
        console.log(`Repeat todo is past due by ${Math.floor(i.length("days"))} days`);
      }
      return DateTime.fromISO(dueDate)
        .plus({ days: Number(recurInteger) })
        .toISODate();
    }
    case RecurReqEnum.w:
    case RecurReqEnum.ws: {
      return DateTime.fromISO(dueDate)
        .plus({ weeks: Number(recurInteger) })
        .toISODate();
    }
    case RecurReqEnum.m:
    case RecurReqEnum.ms: {
      return DateTime.fromISO(dueDate)
        .plus({ months: Number(recurInteger) })
        .toISODate();
    }
    case RecurReqEnum.y:
    case RecurReqEnum.ys: {
      return DateTime.fromISO(dueDate)
        .plus({ years: Number(recurInteger) })
        .toISODate();
    }
  }
};

export default calculateRecurrence;
