import {
 Component,
 Element,
 Event,
 EventEmitter,
 Host,
 Prop,
 State,
 Watch,
 h,
} from '@stencil/core';
import { BaseDropdownEvent } from '../base-dropdown-event';
import { SelectEvents, SelectOption, SelectStyleProps } from '../../components';
import { SelectKeyboardNavigation } from '../sd-select/select-keyboard-navigation';
import { SelectOptionGroup } from '../../types/select';

@Component({
 tag: 'sd-select-group',
 styleUrl: 'sd-select-group.scss',
 shadow: true,
})
export class SdSelectGroup extends BaseDropdownEvent {
 @Element() el!: HTMLElement;

 // props
 @Prop({ mutable: true }) value: string | number | null = null;
 @Prop() label: string = '';
 @Prop() options: SelectOptionGroup[] = [];
 @Prop() placeholder: string = '선택';
 @Prop() optionPlaceholder: string = '옵션이 없습니다.';
 @Prop() width: string = '200px';
 @Prop() dropdownHeight: string = '260px';
 @Prop() disabled: boolean = false;
 @Prop() clearable: boolean = false;
 @Prop() searchable: boolean = false;

 // props - custom styles
 @Prop() containerStyle: SelectStyleProps['containerStyle'] = {};
 @Prop() triggerStyle: SelectStyleProps['triggerStyle'] = {};
 @Prop() dropdownStyle: SelectStyleProps['dropdownStyle'] = {};
 @Prop() optionStyle: SelectStyleProps['optionStyle'] = {};
 @Prop() labelStyle: SelectStyleProps['labelStyle'] = {};

 // props - custom slots
 @Prop() optionRenderer?: (option: SelectOption, index: number, isSelected: boolean) => any;

 // states
 @State() filteredOptions = this.options;
 @State() isOpen: boolean = false;
 @State() searchText: string | null = null;
 @State() itemIndex: number = -1;
 @State() isScrolled: boolean = false;

 // events
 @Event() sdChange?: EventEmitter<SelectEvents['sdChange']>;
 @Event() dropDownShow?: EventEmitter<SelectEvents['dropDownShow']>;

 private selectRef?: HTMLElement;
 private searchRef?: HTMLSdInputElement;
 private optionRef?: HTMLSdSelectOptionGroupElement;

 @Watch('value')
 valueChanged() {
  const selectedOption = this.getSelectedOption();
  this.sdChange?.emit({ value: selectedOption?.value || null, option: selectedOption || null });
 }

 @Watch('options')
 optionsChanged() {
  this.filteredOptions = this.options;
  this.filterOptions();
 }

 @Watch('searchText')
 searchTextChanged() {
  this.filterOptions();
 }

 @Watch('itemIndex')
 async itemIndexChanged(newIndex: number, oldIndex: number) {
  if (this.searchable) {
   const searchInput = await this.getNativeInputElement();
   if (this.itemIndex === -1) {
    searchInput?.focus();
    return;
   } else if (searchInput?.matches(':focus')) {
    searchInput?.blur();
   }
  }

  const optionElements = Array.from(
   this.el.shadowRoot?.querySelectorAll('.sd-select-group__dropdown sd-select-option-group') || [],
  );
  const currentItem = optionElements?.[this.itemIndex];

  if (!currentItem) return;

  this.optionRef = currentItem as HTMLSdSelectOptionGroupElement;
  const isOptionDisabled = await this.optionRef.isDisabled();
  console.log();

  if (isOptionDisabled) {
   newIndex > oldIndex ? this.itemIndex++ : this.itemIndex--;
   return;
  }

  currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }

 connectedCallback() {
  // props가 모두 설정된 후에 실행되므로 올바른 options 값을 가져올 수 있음
  this.filteredOptions = this.options;
  this.initializeEvent(); // global dropdown Manager에 등록 + 이벤트 핸들러 초기화
 }

 disconnectedCallback() {
  this.cleanupEvent(); // global dropdown Manager에서 제거 + 이벤트 정리
 }

 @Watch('isOpen')
 async isOpenChanged() {
  // Base class의 이벤트 관리 호출 - 다른 select와의 이벤트 충돌 방지
  this.onDropdownToggle(this.isOpen);

  const selectedOption = this.getSelectedOption();
  if (!selectedOption) {
   this.itemIndex = this.searchable ? -1 : 0;
  } else {
   this.itemIndex = this.options.indexOf(selectedOption);
  }

  this.dropDownShow?.emit({ isOpen: this.isOpen });

  if (this.isOpen === false) return;

  await new Promise(resolve => setTimeout(resolve, 10));

  const optionElements = Array.from(
   this.el.shadowRoot?.querySelectorAll('.sd-select-group__dropdown sd-select-option-group') || [],
  );
  const currentItem = optionElements?.[this.itemIndex];

  if (this.searchable) {
   const searchInput = await this.getNativeInputElement();
   searchInput?.focus();
  }

  if (!currentItem) return;

  await new Promise(resolve => setTimeout(resolve, 10));
  currentItem.scrollIntoView({ behavior: 'instant', block: 'center' });
 }

 protected handleDocumentClick(event: Event): void {
  if (!this.selectRef?.contains(event.target as Node)) {
   this.isOpen = false;
  }
 }

 protected handleDocumentKeydown(keyboardEvent: KeyboardEvent): void {
  switch (keyboardEvent.key) {
   case 'ArrowDown':
   case 'ArrowUp':
    const keyboardNavigation = new SelectKeyboardNavigation(this.searchable, this.filteredOptions);
    const nextIndex = keyboardNavigation.getNextIndex(this.itemIndex, keyboardEvent.key);
    this.itemIndex = nextIndex;
    break;
   case 'Enter':
    const selectedOption = this.filteredOptions[this.itemIndex];
    if (selectedOption && !selectedOption.disabled) {
     this.value = selectedOption.value;
     this.searchText = null;
     this.isOpen = false;
    }
    break;
   case 'Escape':
    this.isOpen = false;
    break;
  }
 }

 // closeDropdown 메서드 구현 (Manager에서 호출됨)
 closeDropdown() {
  this.isOpen = false;
 }

 // event handlers
 handleTriggerClick = (event: Event) => {
  event.stopPropagation();

  if (!this.disabled) {
   this.isOpen = !this.isOpen;
   this.dropDownShow?.emit({ isOpen: this.isOpen });
  }
 };

 handleOptionClick = (detail: { option: SelectOptionGroup; event: Event }) => {
  const { option, event } = detail;
  event.stopPropagation();

  if (!option.disabled) {
   this.value = option.value;
   this.isOpen = false;
  }
 };

 private filterOptions() {
  if (!this.searchText || this.searchText.trim() === '') {
   // 검색어가 없으면 전체 옵션 표시
   this.filteredOptions = this.options;
  } else {
   // 검색어가 있으면 필터링
   this.filteredOptions = this.options.filter(option =>
    option.label.toLowerCase().includes(this.searchText!.toLowerCase()),
   );
  }
 }

 private getSelectedOption(): SelectOptionGroup | undefined {
  return this.options.find(option => option.value === this.value);
 }

 private handleDropdownScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;

  // 스크롤이 조금이라도 되면 그림자 표시
  this.isScrolled = scrollTop > 0;
 };

 private async getNativeInputElement(): Promise<HTMLInputElement | null> {
  if (this.searchRef) {
   return this.searchRef.getNativeElement();
  }
  return null;
 }

 // render method
 render() {
  const style = {
   '--select-width': this.width || '200px',
   '--select-dropdown-height': this.dropdownHeight || '260px',
  };

  return (
   <Host style={style}>
    <div
     class={{
      'sd-select-group': true,
      'sd-select-group--open': this.isOpen,
      'sd-select-group--disabled': this.disabled,
     }}
     style={this.containerStyle}
     ref={el => (this.selectRef = el)}
    >
     {this.renderLabel(this.label, this.labelStyle)}
     <div class="sd-select-group__container">
      {this.renderTrigger()}
      {this.renderDropdown()}
     </div>
    </div>
   </Host>
  );
 }

 private renderLabel(label?: string, labelStyle?: { [key: string]: string }) {
  if (!label) return null;

  return (
   <label class="sd-select-group__label" style={labelStyle}>
    {label}
   </label>
  );
 }

 private renderTrigger() {
  const selectedOption = this.getSelectedOption();
  return (
   <div
    class="sd-select-group__trigger"
    tabindex={this.disabled ? -1 : 0}
    onClick={this.handleTriggerClick}
    style={this.triggerStyle}
   >
    <span class="sd-select-group__value">
     {selectedOption ? selectedOption.label : this.placeholder}
    </span>
    {this.clearable && selectedOption && !this.disabled && (
     <sd-icon
      name="close"
      size={10}
      color="#888"
      class="sd-select-group__clear"
      onClick={event => {
       event.stopPropagation();
       this.value = null;
      }}
     ></sd-icon>
    )}

    <sd-icon
     name="arrowDown"
     color="#888"
     class={{ 'sd-select-group__arrow': true, 'sd-select-group__arrow--open': this.isOpen }}
    ></sd-icon>
   </div>
  );
 }

 private renderDropdown() {
  if (this.isOpen === false) return null;

  return (
   <div
    class="sd-select-group__dropdown"
    style={this.dropdownStyle}
    onScroll={this.handleDropdownScroll}
   >
    {this.searchable && (
     <div
      class={{
       'sd-select-group__search-container': true,
       'sd-select-group__search-container--scrolled': this.isScrolled,
      }}
      onClick={event => event.stopPropagation()}
     >
      <sd-input
       ref={el => (this.searchRef = el)}
       value={this.searchText}
       placeholder="검색"
       clearable
       inputStyle={{ 'padding-left': '8px' }}
       autofocus
       onSdInput={event => {
        this.searchText = String(event?.detail);
       }}
       onSdFocus={() => {
        this.itemIndex = -1;
       }}
      >
       <sd-icon name="search" size={16} color="#737373" slot="prefix"></sd-icon>
      </sd-input>
     </div>
    )}
    {this.filteredOptions.length > 0 ? (
     this.filteredOptions.map((option, index) => (
      <slot name={`option-${option.value}`}>
       <sd-select-option-group
        option={option}
        index={index}
        isSelected={option.value === this.value}
        isFocused={index === this.itemIndex}
        optionStyle={this.optionStyle}
        onOptionClick={({ detail }) => this.handleOptionClick(detail)}
       ></sd-select-option-group>
      </slot>
     ))
    ) : (
     <slot name="option-placeholder">
      <div class={'sd-select-group__option-placeholder'} style={this.optionStyle}>
       {this.optionPlaceholder}
      </div>
     </slot>
    )}
   </div>
  );
 }
}
