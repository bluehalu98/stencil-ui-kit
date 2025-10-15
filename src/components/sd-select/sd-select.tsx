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
  closeIcon = 'icon/close_12.png';

  // props
  @Prop({ mutable: true }) value: string | number;
  @Prop() label: string;
  @Prop() options: SelectOption[] = [];
  @Prop() placeholder: string = '선택';
  @Prop() width: string = '200px';
  @Prop() disabled: boolean = false;
  @Prop() clearable: boolean = false;

  // props - custom styles
  @Prop() containerStyle: { [key: string]: string };
  @Prop() triggerStyle: { [key: string]: string };
  @Prop() dropdownStyle: { [key: string]: string };
  @Prop() optionStyle: { [key: string]: string };
  @Prop() labelStyle: { [key: string]: string };

  // states
  @State() isOpen: boolean;

  // events
  @Event() valueChanged: EventEmitter<{ value: string | number; option: SelectOption }>;
  @Event() dropDownShow: EventEmitter<{ isOpen: boolean }>;

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
      this.dropDownShow.emit({ isOpen: this.isOpen });
    }
  }
  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowDown') {
      console.log('down arrow pressed');
    }

    if (ev.key === 'ArrowUp') {
      console.log('up arrow pressed');
    }
  }

  // event handlers
  handleTriggerClick = (event: Event) => {
    event.stopPropagation();

    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.dropDownShow.emit({ isOpen: this.isOpen });
    }
  };

  handleOptionClick = (option: SelectOption, event: Event) => {
    event.stopPropagation();

    if (!option.disabled) {
      this.value = option.value;
      this.isOpen = false;
      this.valueChanged.emit({ value: option.value, option });
    }
  };

  // private methods
  private getSelectedOption(): SelectOption | undefined {
    return this.options.find(option => option.value === this.value);
  }

  // render method
  render() {
    const dropDownIconSrc = getAssetPath(`../../assets/${this.dropDownIcon}`);
    const closeIconSrc = getAssetPath(`../../assets/${this.closeIcon}`);

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
          style={this.containerStyle}
          ref={el => (this.selectRef = el)}
        >
          {this.label && (
            <label class="sd-select__label" style={this.labelStyle}>
              {this.label}
            </label>
          )}
          <div class="sd-select__container">
            <div class="sd-select__trigger" onClick={this.handleTriggerClick} style={this.triggerStyle}>
              <span class="sd-select__value">{selectedOption ? selectedOption.label : this.placeholder}</span>
              {this.clearable && selectedOption && !this.disabled && (
                <button
                  class="sd-select__clear"
                  onClick={event => {
                    event.stopPropagation();
                    this.value = null;
                    this.valueChanged.emit({ value: null, option: null });
                  }}
                >
                  <img src={closeIconSrc} />
                </button>
              )}
              <img class={{ 'sd-select__arrow': true, 'sd-select__arrow--open': this.isOpen }} src={dropDownIconSrc} alt="Dropdown Icon" />
            </div>

            {this.isOpen && (
              <div class="sd-select__dropdown" style={this.dropdownStyle}>
                {this.options.map(option => (
                  <div
                    key={option.value}
                    class={{
                      'sd-select__option': true,
                      'sd-select__option--selected': option.value === this.value,
                      'sd-select__option--disabled': option.disabled,
                    }}
                    style={this.optionStyle}
                    onClick={event => this.handleOptionClick(option, event)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
