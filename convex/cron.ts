import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "delete expired notes",
  {
    hourUTC: 0,
    minuteUTC: 0,
  },
  internal.notes.deleteExpiredNotes,
);

export default crons;
