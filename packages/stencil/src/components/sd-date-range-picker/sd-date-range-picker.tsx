import {
 Component,
 Element,
 Prop,
 State,
 Event,
 h,
 EventEmitter,
 Host,
 Fragment,
} from '@stencil/core';
import { useDatePicker } from '../../modules/useDatePicker';
import { addDays, today } from '../../utils/date';
import { Type } from '../sd-date-box/sd-date-box';

@Component({
 tag: 'sd-date-range-picker',
 styleUrl: 'sd-date-range-picker.scss',
 scoped: true,
})
export class SdDateRangePicker {
 @Element() el!: HTMLElement;

 @Prop() date: [string, string] = ['', ''];
 @Prop() label?: string;
 @Prop() selectable?: [string, string];
 @Prop() maxRange?: number;
 @Prop() disabled: boolean = false;

 @State() isOpen: boolean = false;
 @State() dateRange: [string, string] = this.date;
 @State() hoverDate: string = '';
 @State() prevYear: number = Number(this.dateRange[0].split('-')[0]);
 @State() prevMonth: number = Number(this.dateRange[0].split('-')[1]);

 @Event() sdChange!: EventEmitter<[string, string]>;

 private inputEl?: HTMLElement;
 private dateUtil = useDatePicker();
 private tempDateRange: [string, string] = ['', ''];

 componentWillLoad() {
  this.resetCalendarByDateRange();
 }

 private resetCalendarByDateRange() {
  this.dateRange = this.date;

  const start = this.dateRange[0] || today;
  const end = this.dateRange[1] || start;

  const [startYear, startMonth] = start.split('-').map(Number);
  const [todayYear, todayMonth] = today.split('-').map(Number);

  if (end <= today) {
   // A. 완전 과거 검색(당월 포함X): 좌측 = 시작월 / 우측 = 종료월
   this.prevYear = startYear;
   this.prevMonth = startMonth;
  } else if (start < today && end > today) {
   // B. 과거~미래 걸침(당월 포함O): 좌측 = 오늘의 달
   this.prevYear = todayYear;
   this.prevMonth = todayMonth;
  } else {
   // C. 완전 미래 검색(당월 포함X): 좌측 = 시작월
   this.prevYear = startYear;
   this.prevMonth = startMonth;
  }
 }

 private openMenu() {
  if (this.disabled) return;

  this.tempDateRange = [...this.dateRange];
  this.resetCalendarByDateRange();
  this.isOpen = true;
 }

 private get nextYear(): number {
  return this.prevMonth + 1 === 13 ? this.prevYear + 1 : this.prevYear;
 }

 private get nextMonth(): number {
  return this.prevMonth + 1 === 13 ? 1 : this.prevMonth + 1;
 }

 private get prevCalendar() {
  return this.dateUtil.createCalendar(this.prevYear, this.prevMonth);
 }

 private get nextCalendar() {
  return this.dateUtil.createCalendar(this.nextYear, this.nextMonth);
 }

 private getDateBoxType(date: string): Type {
  if (date === this.dateRange[0])
   return this.dateRange[1] ? 'start' : this.hoverDate < this.dateRange[0] ? 'end' : 'start';
  if (date === this.dateRange[1]) return 'end';
  return '';
 }

 private isDisabledDate(date: string): boolean {
  if (this.maxRange && this.dateRange[0] && !this.dateRange[1]) {
   const minDate = addDays(this.dateRange[0], -this.maxRange);
   const maxDate = addDays(this.dateRange[0], this.maxRange);
   return !(minDate <= date && date <= maxDate);
  }

  if (!this.selectable || !this.selectable[0] || !this.selectable[1]) {
   return false;
  }
  return !(date >= this.selectable[0] && date <= this.selectable[1]);
 }

 private isDateInRange(date: string): boolean {
  // 1. 날짜 범위가 완전히 선택된 경우
  if (this.dateRange[0] && this.dateRange[1]) {
   return date >= this.dateRange[0] && date <= this.dateRange[1];
  }

  // 2. hover 상태의 날짜 범위를 확인
  if (!this.hoverDate || !this.dateRange[0] || this.dateRange[1]) {
   return false;
  }

  // 3. dateRange[0]과 hoverDate를 기준으로 범위 계산
  const [start, end] =
   this.dateRange[0] <= this.hoverDate
    ? [this.dateRange[0], this.hoverDate]
    : [this.hoverDate, this.dateRange[0]];

  return date >= start && date <= end;
 }

 private setPrevYear(year: number) {
  this.prevYear = year;
 }

 private setPrevMonth(month: number) {
  this.prevMonth = month;
 }

 private updateYearMonth(type: 'prev' | 'next') {
  const { newYear, newMonth } = this.dateUtil.calculateYearMonth(
   this.prevYear,
   this.prevMonth,
   type,
  );

  this.setPrevYear(newYear);
  this.setPrevMonth(newMonth);
 }

 private setHoverDate(date: string) {
  this.hoverDate = date;
 }

 private setDateRange(dateRange: [string, string]) {
  this.dateRange = dateRange;
 }

 private handleDateClick(type: 'prev' | 'next', day: number) {
  this.setHoverDate('');

  const selectedDate =
   type === 'prev'
    ? this.dateUtil.formatDate(this.prevYear, this.prevMonth, day)
    : this.dateUtil.formatDate(this.nextYear, this.nextMonth, day);

  if (!this.dateRange[0] || !!this.dateRange[1] || selectedDate < this.dateRange[0]) {
   this.setDateRange([selectedDate, '']);
   return; // 아직 완료 아님
  }

  const newRange: [string, string] = [this.dateRange[0], selectedDate];
  this.setDateRange(newRange);
  this.sdChange.emit?.(newRange);
 }

 private handleDateHover(type: 'prev' | 'next', day: number) {
  const hoverDate =
   type === 'prev'
    ? this.dateUtil.formatDate(this.prevYear, this.prevMonth, day)
    : this.dateUtil.formatDate(this.nextYear, this.nextMonth, day);
  this.setHoverDate(hoverDate);
 }

 private handleClose = () => {
  if (!this.dateRange[0] || !this.dateRange[1]) {
   this.dateRange = [...this.tempDateRange];
  }

  this.isOpen = false;
 };

 render() {
  return (
   <Host class="sd-date-range-picker">
    <sd-input
     ref={el => (this.inputEl = el as unknown as HTMLElement)}
     value={`${this.dateRange[0]} ~ ${this.dateRange[1]}`}
     label={this.label}
     inside-label
     readonly
     disabled={this.disabled}
     inputClass="text-center"
     inputStyle={{
      margin: '0 0 0 8px',
     }}
     onClick={() => this.openMenu()}
    >
     <sd-icon
      slot="prefix"
      name="date"
      size="16"
      color="#737373"
      class="date-icon"
      onClick={() => this.openMenu()}
     ></sd-icon>
    </sd-input>

    {this.isOpen && (
     <sd-portal open={this.isOpen} parentRef={this.inputEl} onSdClose={this.handleClose}>
      <div class="sd-date-range-picker__menu">
       <div class="sd-date-range-picker__header mb-16pxr flex flex-nowrap items-center justify-center">
        <button
         type="button"
         name="prev"
         title="Previous"
         onClick={() => this.setPrevYear(this.prevYear - 1)}
        >
         <sd-icon name="arrowLeft" size="12" color="#CCCCCC" />
        </button>

        <div class="header-label">{this.prevYear}</div>

        <button
         type="button"
         name="next"
         title="Next"
         onClick={() => this.setPrevYear(this.prevYear + 1)}
        >
         <sd-icon name="arrowRight" size="12" color="#CCCCCC" />
        </button>
       </div>

       <div class="sd-date-range-picker__body">
        {[this.prevCalendar, this.nextCalendar].map((calendar, index) => (
         <Fragment>
          {index === 1 && <div class="separator"></div>}

          <div key={index} class="calendar-container">
           <div class="calendar-header">
            <button
             type="button"
             name="month"
             title="Month"
             class={index === 0 ? 'header-button-prev' : 'header-button-next'}
             onClick={() => this.updateYearMonth(index === 0 ? 'prev' : 'next')}
            >
             <sd-icon name={index === 0 ? 'arrowLeft' : 'arrowRight'} size="12" color="#CCCCCC" />
            </button>
            {index === 0
             ? `${this.prevYear}.${String(this.prevMonth).padStart(2, '0')}`
             : `${this.nextYear}.${String(this.nextMonth).padStart(2, '0')}`}
           </div>

           <div class="calendar-days">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
             <sd-date-box key={day} date={day} disabled class="day" />
            ))}
           </div>

           <div class="calendar-body mt-12pxr grid grid-cols-7 gap-y-8pxr">
            {[...calendar.prevMonthDays, ...calendar.days, ...calendar.afterMonthDays].map(
             (day, idx) => (
              <sd-date-box
               key={`prev${day}_${idx}`}
               date={!day ? '' : Number(day)}
               selected={this.dateRange.some(
                date =>
                 date ===
                 this.dateUtil.formatDate(
                  index === 0 ? this.prevYear : this.nextYear,
                  index === 0 ? this.prevMonth : this.nextMonth,
                  Number(day),
                 ),
               )}
               type={this.getDateBoxType(
                this.dateUtil.formatDate(
                 index === 0 ? this.prevYear : this.nextYear,
                 index === 0 ? this.prevMonth : this.nextMonth,
                 Number(day),
                ),
               )}
               isToday={
                today ===
                this.dateUtil.formatDate(
                 index === 0 ? this.prevYear : this.nextYear,
                 index === 0 ? this.prevMonth : this.nextMonth,
                 Number(day),
                )
               }
               disabled={
                !day
                 ? true
                 : this.isDisabledDate(
                    this.dateUtil.formatDate(
                     index === 0 ? this.prevYear : this.nextYear,
                     index === 0 ? this.prevMonth : this.nextMonth,
                     Number(day),
                    ),
                   )
               }
               inRange={this.isDateInRange(
                this.dateUtil.formatDate(
                 index === 0 ? this.prevYear : this.nextYear,
                 index === 0 ? this.prevMonth : this.nextMonth,
                 Number(day),
                ),
               )}
               onClick={() => this.handleDateClick(index === 0 ? 'prev' : 'next', Number(day))}
               onMouseOver={() => this.handleDateHover(index === 0 ? 'prev' : 'next', Number(day))}
              />
             ),
            )}
           </div>
          </div>
         </Fragment>
        ))}
       </div>
      </div>
     </sd-portal>
    )}
   </Host>
  );
 }
}
