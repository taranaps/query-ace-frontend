export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const [time, period] = formattedTime.split(" ");
  const [hours, minutes] = time.split(":");
  
  return `${hours.padStart(2, '0')}:${minutes} ${period.toUpperCase()}`;
};