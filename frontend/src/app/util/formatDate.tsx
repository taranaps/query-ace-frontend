

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }).format(date);

    let [time, period] = formattedDate.split(', ');

    period = period.toUpperCase();

    return `${time} ${period}`;
};
