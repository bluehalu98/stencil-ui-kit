import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

export type Type = 'start' | 'end' | '';

@Component({
 tag: 'sd-date-box',
 styleUrl: 'sd-date-box.scss',
 scoped: true,
})
export class SdDateBox {
 @Prop() date: number | string | null = null;
 @Prop() disabled: boolean = false;
 @Prop() selected: boolean = false;
 @Prop() isStartDate: boolean = false;
 @Prop() isEndDate: boolean = false;
 @Prop() isToday: boolean = false;
 @Prop() inRange: boolean = false;
 @Prop() type: Type = '';

 @Event() sdClick?: EventEmitter<number | string | null>;
 @Event() sdMouseOver?: EventEmitter<number | string | null>;

 private handleClickDate() {
  console.log(this.disabled);
  if (this.disabled) return;
  if (typeof this.date === 'string') return;

  this.sdClick?.emit(this.date);
 }

 private handleHoverDate() {
  if (typeof this.date === 'string') return;

  this.sdMouseOver?.emit(this.date);
 }

 render() {
  return (
   <Host
    role="button"
    aria-disabled={this.disabled ? 'true' : 'false'}
    tabindex={this.disabled ? -1 : 0}
    class={{
     'sd-date-box': true,
     'sd-hoverable': !this.disabled || !this.selected || this.type === '',
     'sd-date-box--disabled': this.disabled,
     'sd-date-box--selected': this.selected,
     'sd-date-box--today': this.isToday,
     'sd-date-box--start-date': this.isStartDate,
     'sd-date-box--end-date': this.isEndDate,
     'sd-date-box--in-range': this.inRange,
     'sd-date-box--type-start': this.type === 'start',
     'sd-date-box--type-end': this.type === 'end',
    }}
    onClick={() => this.handleClickDate()}
    onMouseOver={() => this.handleHoverDate()}
   >
    <div class="sd-date-box__content">
     <div class="sd-date-box__label">{this.date}</div>
    </div>
   </Host>
  );
 }
}
