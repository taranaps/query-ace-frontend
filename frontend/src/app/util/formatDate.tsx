// export const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
  
//   if (isNaN(date.getTime())) {
//     return 'Invalid date';
//   }

//   const formattedTime = new Intl.DateTimeFormat("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//     // timeZone:"Asia/Kolkata"
//   }).format(date);

//   const [time, period] = formattedTime.split(" ");
//   const [hours, minutes] = time.split(":");
  
//   return `${hours.padStart(2, '0')}:${minutes} ${period.toUpperCase()}`;
// };

export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "Invalid date";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error(`Invalid date string: ${dateString}`);
    return "Invalid date";
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);


  return `${formattedDate}`;
};