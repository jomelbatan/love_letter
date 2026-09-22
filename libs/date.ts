// utils/date.ts

export function getDuration(startDate: string, endDate = new Date()): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (end.getDate() < start.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  }

  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  }

  return parts.length > 0 ? parts.join(", ") : "Less than a month";
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = Math.max(0, now - timestamp);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  // Less than 1 minute
  if (diff < minute) {
    return "just now";
  }

  // Minutes
  if (diff < hour) {
    const minutes = Math.floor(diff / minute);

    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  // Hours
  if (diff < day) {
    const hours = Math.floor(diff / hour);

    return hours === 1 ? "about an hour ago" : `${hours} hours ago`;
  }

  const date = new Date(timestamp);
  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const daysAgo = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / day,
  );

  // Yesterday
  if (daysAgo === 1) {
    return (
      "yesterday" +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  }

  // Older — same year
  if (date.getFullYear() === today.getFullYear()) {
    return (
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  }

  // Older — different year
  return (
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
}
