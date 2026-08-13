export function formatTransferDate(
    date: Date | string
): string {
    const transferDate = new Date(date);

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (
        first: Date,
        second: Date
    ) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();

    if (isSameDay(transferDate, today)) {
        return "Today";
    }

    if (isSameDay(transferDate, yesterday)) {
        return "Yesterday";
    }

    const diff =
        (today.getTime() - transferDate.getTime()) /
        (1000 * 60 * 60 * 24);

    if (diff < 7) {
        return transferDate.toLocaleDateString(undefined, {
            weekday: "long",
        });
    }

    return transferDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}