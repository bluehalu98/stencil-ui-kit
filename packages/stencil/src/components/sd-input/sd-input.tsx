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
 Method,
} from '@stencil/core';

@Component({
 tag: 'sd-input',
 styleUrl: 'sd-input.scss',
})
export class SdInput {
 @Element() el!: HTMLElement;

 @Prop({ mutable: true }) value?: string | number | null = null;
 @Prop() label?: string;
 @Prop() placeholder: string = '입력해 주세요.';
 @Prop() disabled: boolean = false;
 @Prop() clearable: boolean = false;
 @Prop() width?: number | string;
 @Prop() barcode?: boolean = false;
 @Prop() rules?: Array<(value: string | number | null) => boolean | string>;
 @Prop() autoFocus: boolean = false;
 @Prop() status?: 'default' | 'pass' | 'error';
 @Prop() inputClass: string = '';
 @Prop() readonly: boolean = false;

 //  props - custom styles
 @Prop() inputStyle: { [key: string]: string } = {};

 @State() private internalValue: string | number | null = null;
 @State() private error: boolean = false;
 @State() private focused: boolean = false;
 @State() private hovered: boolean = false;

 private nativeEl: HTMLInputElement | undefined = undefined;

 @Event() sdClick?: EventEmitter<string | number | null>;
 @Event() sdInput?: EventEmitter<string | number | null>;
 @Event() sdChange?: EventEmitter<string | number | null>;
 @Event() sdFocus?: EventEmitter<Event>;
 @Event() sdBlur?: EventEmitter<Event>;

 @Watch('value')
 valueChanged(newValue: string | number | null) {
  this.internalValue = newValue;
 }

 @Watch('internalValue')
 internalValueChanged(newValue: string | number | null) {
  if (newValue !== this.value) {
   this.value = newValue;
   this.sdInput?.emit(this.value);
  }

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

 @Method()
 async getNativeElement(): Promise<HTMLInputElement | null> {
  return this.nativeEl || null;
 }

 componentWillLoad() {
  if (this.value) {
   this.internalValue = this.value;
  }
 }

 private handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  this.internalValue = target.value;
  this.sdInput?.emit(this.internalValue);
 };

 private handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  this.internalValue = target.value;
  this.sdChange?.emit(this.internalValue);
 };

 private handleFocus = (type: 'focus' | 'blur', event: Event) => {
  this.focused = type === 'focus';

  if (type === 'blur') this.sdBlur?.emit(event);
  else this.sdFocus?.emit(event);
 };

 getInputStatus() {
  // input 상태 우선순위: hovered > focused > status(상태 주입) > error(rules 검사)
  if (this.disabled) return 'sd-input--disabled';
  if (this.hovered) return 'sd-input--hovered';
  if (this.focused) return 'sd-input--focused';
  if (this.status) return `sd-input--${this.status}`;
  if (this.error) return 'sd-input--error';
  return '';
 }

 render() {
  const inputWidth = this.width
   ? {
      '--input-width': typeof this.width === 'number' ? `${this.width}px` : this.width,
     }
   : {};

  return (
   <Host style={inputWidth}>
    {this.label && <div class="sd-input__label">{this.label}</div>}
    <label
     class={{
      'sd-input': true,
      [this.getInputStatus()]: true,
      'sd-input--barcode': !!this.barcode,
     }}
     onMouseEnter={() => (this.hovered = true)}
     onMouseLeave={() => (this.hovered = false)}
     style={this.inputStyle}
    >
     <slot name="prefix"></slot>
     <input
      ref={el => (this.nativeEl = el)}
      class={`sd-input__native_element ${this.inputClass}`}
      type="text"
      value={this.internalValue || ''}
      placeholder={this.placeholder}
      disabled={this.disabled}
      readonly={this.readonly}
      autofocus={this.autoFocus}
      onInput={this.handleInput}
      onChange={this.handleChange}
      onFocus={event => this.handleFocus('focus', event)}
      onBlur={event => this.handleFocus('blur', event)}
     />
     <slot name="suffix"></slot>
     {this.clearable && this.internalValue && (
      <sd-icon
       name="close"
       color="#888"
       style={{ marginRight: '-4px', marginLeft: '8px', cursor: 'pointer' }}
       onClick={() => {
        this.internalValue = '';
        this.sdChange?.emit(this.internalValue);
        this.sdInput?.emit(this.internalValue);
       }}
      />
     )}
    </label>
   </Host>
  );
 }
}
