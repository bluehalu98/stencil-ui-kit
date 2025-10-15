import { Component, Event, EventEmitter, Host, Prop, State, h, Listen, getAssetPath } from '@stencil/core';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  tag: 'sd-select',
  styleUrls: ['sd-select.scss'],
  shadow: true,
  assetsDirs: ['../../assets'],
})
export class SdSelect {
  dropDownIcon = 'icon/arrow_down_12.png';

  // props
  @Prop() options: SelectOption[] = [];
  @Prop({ mutable: true }) value: string | number;
  @Prop() placeholder: string = '선택';
  @Prop() width: string = '200px';
  @Prop() disabled: boolean = false;
  @Prop() customStyle: { [key: string]: string };

  // states
  @State() isOpen: boolean;

  // events
  @Event() selectionChanged: EventEmitter<{ value: string | number; option: SelectOption }>;

  private selectRef?: HTMLElement;

  // lifecycle methods
  connectedCallback() {
    this.isOpen = false;
  }

  // listeners
  @Listen('click', { target: 'document' })
  handleDocumentClick(event: Event) {
    if (!this.selectRef?.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  // event handlers
  handleTriggerClick = (event: Event) => {
    event.stopPropagation();
    console.log('handleTriggerClick - before:', this.isOpen);

    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      console.log('handleTriggerClick - after:', this.isOpen);
    }
  };

  handleOptionClick = (option: SelectOption, event: Event) => {
    event.stopPropagation();

    if (!option.disabled) {
      this.value = option.value;
      this.isOpen = false;
      this.selectionChanged.emit({ value: option.value, option });
    }
  };

  // private methods
  private getSelectedOption(): SelectOption | undefined {
    return this.options.find(option => option.value === this.value);
  }

  // render method
  render() {
    const dropDownIconSrc = getAssetPath(`../../assets/${this.dropDownIcon}`);
    const selectedOption = this.getSelectedOption();

    const selectWidth = {
      '--select-width': this.width || '200px',
    };

    return (
      <Host style={selectWidth}>
        <div
          class={{
            'sd-select': true,
            'sd-select--open': this.isOpen,
            'sd-select--disabled': this.disabled,
          }}
          style={this.customStyle}
          ref={el => (this.selectRef = el)}
        >
          <div class="sd-select__trigger" onClick={this.handleTriggerClick}>
            <span class="sd-select__value">{selectedOption ? selectedOption.label : this.placeholder}</span>
            <img class={{ 'sd-select__arrow': true, 'sd-select__arrow--open': this.isOpen }} src={dropDownIconSrc} alt="Dropdown Icon" />
          </div>

          {this.isOpen && (
            <div class="sd-select__dropdown">
              {this.options.map(option => (
                <div
                  key={option.value}
                  class={{
                    'sd-select__option': true,
                    'sd-select__option--selected': option.value === this.value,
                    'sd-select__option--disabled': option.disabled,
                  }}
                  onClick={event => this.handleOptionClick(option, event)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
