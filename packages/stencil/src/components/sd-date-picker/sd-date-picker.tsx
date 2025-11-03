import { Component, Element, Prop, State, Event, h, EventEmitter, Host } from '@stencil/core';
import { useDatePicker } from '../../modules/useDatePicker';
import { today } from '../../utils/date';

@Component({
 tag: 'sd-date-picker',
 styleUrl: 'sd-date-picker.scss',
 scoped: true,
})
export class SdDatePicker {
 @Element() el!: HTMLElement;

 @Prop() date: string | null = null;
 @Prop() label?: string;
 @Prop() selectable?: [string, string];
 @Prop() disabled: boolean = false;

 @State() isOpen: boolean = false;
 @State() currentDate: string | null = null;
 @State() currentYear!: number;
 @State() currentMonth!: number;

 @Event() sdChange!: EventEmitter<string | null>;

 componentWillLoad() {
  this.setCalendar();
 }

 private dateUtil = useDatePicker();
 private inputEl?: HTMLElement;

 private setCalendar() {
  const base = this.date || today;
  const [year, month] = base.split('-').map(Number);
  this.currentYear = year;
  this.currentMonth = month;
  this.currentDate = this.date;
 }

 private openMenu() {
  if (this.disabled) return;

  this.setCalendar();
  this.isOpen = true;
 }

 private get calendar() {
  return this.dateUtil.createCalendar(this.currentYear, this.currentMonth);
 }

 private setCurrentYear(year: number) {
  this.currentYear = year;
 }

 private setCurrentMonth(month: number) {
  this.currentMonth = month;
 }

 private setCurrentDate(date: string | null) {
  this.currentDate = date;
 }

 private handleUpdateMonth(type: 'prev' | 'next') {
  const { newYear, newMonth } = this.dateUtil.calculateYearMonth(
   this.currentYear,
   this.currentMonth,
   type,
  );
  this.setCurrentYear(newYear);
  this.setCurrentMonth(newMonth);
 }

 private handleDateClick(day: number) {
  if (!day) return;

  const date = this.dateUtil.formatDate(this.currentYear, this.currentMonth, day);
  this.setCurrentDate(date);
  this.isOpen = false;
  this.sdChange.emit?.(date);
 }

 private isDisabledDate(date: string): boolean {
  if (!this.selectable) return false;

  const [startSelectable, endSelectable] = this.selectable;

  if (startSelectable && endSelectable) {
   return date < startSelectable || date > endSelectable;
  }

  if (startSelectable) {
   return date < startSelectable;
  }

  if (endSelectable) {
   return date > endSelectable;
  }

  return false;
 }

 private handleClose = () => {
  this.isOpen = false;
 };

 render() {
  return (
   <Host class="sd-date-picker">
    <sd-input
     ref={el => (this.inputEl = el as unknown as HTMLElement)}
     value={this.date}
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
      <div class="sd-date-picker__menu">
       <div class="sd-date-picker__header">
        {/* Year Navigation */}
        <div class="year-nav">
         <button
          type="button"
          name="prev-year"
          title="Previous Year"
          onClick={() => this.setCurrentYear(this.currentYear - 1)}
         >
          <sd-icon name="arrowLeft" size="12" color="#CCCCCC" />
         </button>
         <span class="year-nav__current">{this.currentYear}</span>
         <button
          type="button"
          name="next-year"
          title="Next Year"
          onClick={() => this.setCurrentYear(this.currentYear + 1)}
         >
          <sd-icon name="arrowRight" size="12" color="#CCCCCC" />
         </button>
        </div>

        {/* Month Navigation */}
        <div class="month-nav">
         <button
          type="button"
          name="prev-month"
          title="Previous       "
          onClick={() => this.handleUpdateMonth('prev')}
         >
          <sd-icon name="arrowLeft" size="12" color="#CCCCCC" />
         </button>
         <span class="month-nav__current">{this.currentMonth}월</span>
         <button
          type="button"
          name="next-month"
          title="Next Month"
          onClick={() => this.handleUpdateMonth('next')}
         >
          <sd-icon name="arrowRight" size="12" color="#CCCCCC" />
         </button>
        </div>
       </div>

       <div class="sd-date-picker__days">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
         <div key={day} class="day">
          {day}
         </div>
        ))}
       </div>

       <div class="sd-date-picker__body">
        {[
         ...this.calendar.prevMonthDays,
         ...this.calendar.days,
         ...this.calendar.afterMonthDays,
        ].map((day, idx) => {
         const formattedDate = this.dateUtil.formatDate(
          this.currentYear,
          this.currentMonth,
          Number(day),
         );

         return (
          <sd-date-box
           key={`${day}_${idx}`}
           date={!day ? '' : Number(day)}
           selected={this.currentDate === formattedDate}
           isToday={today === formattedDate}
           disabled={!day ? true : this.isDisabledDate(formattedDate)}
           onClick={
            !this.isDisabledDate(formattedDate) && day
             ? () => this.handleDateClick(Number(day))
             : undefined
           }
          />
         );
        })}
       </div>
      </div>
     </sd-portal>
    )}
   </Host>
  );
 }
}
