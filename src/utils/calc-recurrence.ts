import { DateTime } from "luxon";

import { RecurReqEnum } from "../models/todo";

const calculateRecurrence = (dueDate: string, recurVal: string) => {
  switch (recurVal) {
    case RecurReqEnum.d: {
      return DateTime.fromISO(dueDate).plus({ days: 1 }).toISODate();
    }
    case RecurReqEnum.w: {
      return DateTime.fromISO(dueDate).plus({ weeks: 1 }).toISODate();
    }
    case RecurReqEnum.m: {
      return DateTime.fromISO(dueDate).plus({ months: 1 }).toISODate();
    }
    case RecurReqEnum.y: {
      return DateTime.fromISO(dueDate).plus({ years: 1 }).toISODate();
    }
  }
};

export default calculateRecurrence;
