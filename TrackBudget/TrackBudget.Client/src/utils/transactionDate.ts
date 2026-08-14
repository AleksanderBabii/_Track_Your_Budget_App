export function formatTransactionDate(date: Date | string): string {
  const transactionDate = new Date(date);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  if (isSameDay(transactionDate, today)) {
    return "Today";
  }

  if (isSameDay(transactionDate, yesterday)) {
    return "Yesterday";
  }

  const diff =
    (today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diff < 7) {
    return transactionDate.toLocaleDateString(undefined, {
      weekday: "long",
    });
  }

  return transactionDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
