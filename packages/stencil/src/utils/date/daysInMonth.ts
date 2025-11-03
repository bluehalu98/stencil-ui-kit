export const daysInMonth = (date: string): number[] => {
 const year = Number(date.split('-')[0]);
 const month = Number(date.split('-')[1]);
 const daysInMonth = new Date(year, month, 0).getDate(); // month에 0을 전달하면 전달의 마지막 날짜를 반환
 return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};
