export const addDays = (inputDate: string, days: number) => {
 const [year, month, day] = inputDate.split('-').map(Number);
 const date = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1

 // 날짜 계산
 date.setDate(date.getDate() + days);

 // yyyy-mm-dd 형식으로 변환
 const resultYear = date.getFullYear();
 const resultMonth = String(date.getMonth() + 1).padStart(2, '0');
 const resultDay = String(date.getDate()).padStart(2, '0');

 return `${resultYear}-${resultMonth}-${resultDay}`;
};
