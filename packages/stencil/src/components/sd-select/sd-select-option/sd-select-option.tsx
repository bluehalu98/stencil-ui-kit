import { Component, Element, Event, EventEmitter, h, Method, Prop, State } from '@stencil/core';
import type { SelectOption } from '../../../types/select';

@Component({
 tag: 'sd-select-option',
 styleUrl: 'sd-select-option.scss',
 shadow: true,
})
export class SdSelectOption {
 @Element() el!: HTMLElement;

 @Prop() option!: SelectOption;
 @Prop() index!: number;
 @Prop() isSelected: boolean = false;
 @Prop() isFocused: boolean = false;
 @Prop() optionStyle?: { [key: string]: string };
 @Prop() disabled: boolean = false;
 @Prop() useCheckbox: boolean = false;

 @State() isHovered: boolean = false;

 @Method()
 async isDisabled(): Promise<boolean> {
  return !!this.option.disabled;
 }

 @Event() optionClick!: EventEmitter<{
  option: SelectOption;
  index: number;
  event: MouseEvent;
 }>;

 private handleClick = (event: MouseEvent) => {
  event.stopPropagation();

  if (!this.option.disabled && !this.disabled) {
   this.optionClick.emit({
    option: this.option,
    index: this.index,
    event,
   });
  }
 };

 render() {
  return (
   <div
    class={{
     'sd-select__option': true,
     'sd-select__option--selected': this.isSelected,
     'sd-select__option--disabled': !!this.option.disabled,
     'sd-select__option--focused': this.isFocused,
     'sd-select__option--use-checkbox': this.useCheckbox,
    }}
    onMouseEnter={() => (this.isHovered = true)}
    onMouseLeave={() => (this.isHovered = false)}
    style={this.optionStyle}
    data-index={this.index}
    onClick={this.handleClick}
   >
    {this.useCheckbox ? (
     <div class="sd-select__option__checkbox-wrapper">
      <sd-checkbox
       checked={this.isSelected}
       disabled={this.option.disabled}
       checkboxStyle={
        !this.isSelected
         ? { borderColor: '#888' }
         : this.isHovered
           ? { borderColor: 'white' }
           : { borderColor: '#0075ff' }
       }
       onClick={e => {
        e.preventDefault();
        this.handleClick(e);
       }}
      ></sd-checkbox>
      <span class="sd-select__option-label">{this.option.label}</span>
     </div>
    ) : (
     this.option.label
    )}
   </div>
  );
 }
}
