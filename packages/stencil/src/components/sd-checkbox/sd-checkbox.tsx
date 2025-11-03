import { Component, Prop, h, Element, Event, EventEmitter, State, Watch } from '@stencil/core';

@Component({
  tag: 'sd-checkbox',
  styleUrl: 'sd-checkbox.scss',
  shadow: true,
})
export class SdCheckbox {
  @Element() el!: HTMLElement;

  /** 현재 선택 상태 또는 배열 형태의 값 */
  @Prop() checked: any[] | any = false;

  /** 배열 모드에서의 개별 값 */
  @Prop() val?: any;

  /** 비활성화 여부 */
  @Prop() disabled: boolean = false;

  /** 표시할 라벨 텍스트 */
  @Prop() label: string = '';

  @Prop() checkboxStyle: StyleProps = {};

  /** 내부 체크 상태 */
  @State() private isChecked: boolean = false;

  /** 값 변경 이벤트 */
  @Event() sdChange!: EventEmitter<any | any[]>;

  componentWillLoad() {
    this.updateCheckedState(this.checked);
  }

  @Watch('checked')
  watchValueHandler(newValue: any | any[]) {
    this.updateCheckedState(newValue);
  }

  private getCheckboxClasses(): string {
    const classes = ['sd-checkbox', `sd-checkbox--${this.isChecked ? 'checked' : 'unchecked'}`];

    if (this.disabled) {
      classes.push('sd-checkbox--disabled');
    }

    return classes.join(' ');
  }

  private updateCheckedState(value: any | any[]) {
    if (typeof value === 'boolean') {
      this.isChecked = value;
    } else if (Array.isArray(value)) {
      this.isChecked = this.val !== undefined && value.includes(this.val);
    } else {
      this.isChecked = false;
    }
  }

  private handleChange = () => {
    if (this.disabled) return;

    let newValue: any | any[];

    if (typeof this.checked === 'boolean') {
      newValue = !this.checked;
    } else if (Array.isArray(this.checked)) {
      if (this.val === undefined) {
        console.warn('A "val" property is required when using an array for the "value" property.');
        return;
      }

      const valueSet = new Set(this.checked);
      valueSet.has(this.val) ? valueSet.delete(this.val) : valueSet.add(this.val);
      newValue = Array.from(valueSet);
    } else {
      newValue = !this.isChecked;
    }

    this.sdChange.emit(newValue);
  };

  render() {
    return (
      <label class={this.getCheckboxClasses()}>
        <input type="checkbox" checked={this.isChecked} disabled={this.disabled} onChange={this.handleChange} />
        <div class="sd-checkbox__bg" style={this.checkboxStyle}>{this.isChecked ? <sd-icon name="check" size={12} color={this.disabled ? '#888888' : 'white'} /> : null}</div>
        {this.label && <span class="sd-checkbox__label">{this.label}</span>}
      </label>
    );
  }
}
