const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const formatHour = (hour: number): string => `${String(hour).padStart(2, '0')}00`;

export { formatDate, formatHour };
