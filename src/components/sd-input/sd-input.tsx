import {
 Component,
 Element,
 Host,
 Prop,
 State,
 Watch,
 Event,
 EventEmitter,
 h,
} from '@stencil/core';

@Component({
 tag: 'sd-input',
 styleUrls: ['../../styles/global.css', 'sd-input.scss'],
 shadow: true,
})
export class SdInput {
 @Element() el!: HTMLElement;

 @Prop() value?: string | number | null = null;
 @Prop() label?: string;
 @Prop() placeholder: string = '입력해 주세요.';
 @Prop() disabled: boolean = false;
 @Prop() clearable: boolean = false;
 @Prop() width?: number;
 @Prop() barcode?: boolean = false;
 @Prop() rules?: Array<(value: string | number | null) => boolean | string>;

 @State() private internalValue: string | number | null = null;
 @State() private error: boolean = false;

 @Event() onInput?: EventEmitter<string | number | null>;
 @Event() onChange?: EventEmitter<string | number | null>;

 @Watch('value')
 valueChanged(newValue: string | number | null) {
  this.internalValue = newValue;
 }

 @Watch('internalValue')
 internalValueChanged(newValue: string | number | null) {
  if (!this.rules || this.rules.length === 0) return;
  this.error = false;
  for (const rule of this.rules) {
   const result = rule(newValue);
   if (result !== true) {
    this.error = true;
    break;
   }
  }
 }

 private handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  this.internalValue = target.value;
  this.onInput?.emit(this.internalValue);
 };

 private handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  this.internalValue = target.value;
  this.onChange?.emit(this.internalValue);
 };

 render() {
  const inputWidth = this.width
   ? {
      '--input-width': `${this.width}px`,
     }
   : {};

  return (
   <Host style={inputWidth}>
    {this.label && <label>{this.label}</label>}
    <input
     class={{
      'sd-input': true,
      'sd-input--disabled': this.disabled,
      'sd-input--barcode': !!this.barcode,
      'sd-input--error': this.error,
     }}
     type="text"
     value={this.internalValue || ''}
     placeholder={this.placeholder}
     disabled={this.disabled}
     onInput={this.handleInput}
     onChange={this.handleChange}
    />
   </Host>
  );
 }
}
