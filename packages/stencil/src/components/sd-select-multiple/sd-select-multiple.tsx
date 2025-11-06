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
import type { SelectOption, SelectStyleProps, SelectMultipleEvents } from '../../types/select';
import { SelectKeyboardNavigation } from '../../utils/select-keyboard-navigation';
import { BaseDropdownEvent } from '../base-dropdown-event';

@Component({
 tag: 'sd-select-multiple',
 styleUrl: 'sd-select-multiple.scss',
 shadow: true,
})
export class SdSelectMultiple extends BaseDropdownEvent {
 @Element() el!: HTMLElement;

 // props
 @Prop({ mutable: true }) value: SelectOption[] | null = null;
 @Prop() label: string = '';
 @Prop() options: SelectOption[] = [];
 @Prop() placeholder: string = '선택';
 @Prop() optionPlaceholder: string = '옵션이 없습니다.';
 @Prop() width: string = '200px';
 @Prop() dropdownHeight: string = '260px';
 @Prop() disabled: boolean = false;
 @Prop() clearable: boolean = false;
 @Prop() searchable: boolean = false;
 @Prop() useCheckbox: boolean = false;

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
 @Event() sdChange?: EventEmitter<SelectMultipleEvents['sdChange']>;
 @Event() dropDownShow?: EventEmitter<SelectMultipleEvents['dropDownShow']>;

 private selectRef?: HTMLElement;
 private searchRef?: HTMLSdInputElement;
 private optionRef?: HTMLSdSelectOptionElement;

 @Watch('value')
 valueChanged() {
  this.sdChange?.emit(this.value);
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
   this.el.shadowRoot?.querySelectorAll('.sd-select-multiple__dropdown sd-select-option') || [],
  );
  const currentItem = optionElements?.[this.itemIndex];

  if (!currentItem) return;

  this.optionRef = currentItem as HTMLSdSelectOptionElement;
  const isOptionDisabled = await this.optionRef.isDisabled();

  if (isOptionDisabled) {
   newIndex > oldIndex ? this.itemIndex++ : this.itemIndex--;
   return;
  }

  currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }

 @Watch('isOpen')
 async isOpenChanged() {
  this.onDropdownToggle(this.isOpen);

  const selectedOption = this.getSelectedOption();
  if (!selectedOption) {
   this.itemIndex = this.searchable ? -1 : 0;
  } else {
   this.itemIndex = this.options.indexOf(selectedOption[0]);
  }

  this.dropDownShow?.emit({ isOpen: this.isOpen });

  if (this.isOpen === false) return;

  await new Promise(resolve => setTimeout(resolve, 10));

  const optionElements = Array.from(
   this.el.shadowRoot?.querySelectorAll('.sd-select-multiple__dropdown sd-select-option') || [],
  );
  const currentItem = optionElements?.[this.itemIndex];

  // 드롭다운이 열릴 때 검색 입력에 포커스
  if (this.searchable) {
   const searchInput = await this.getNativeInputElement();
   searchInput?.focus();
  }

  if (!currentItem) return;

  await new Promise(resolve => setTimeout(resolve, 10)); // 추가 딜레이
  currentItem.scrollIntoView({ behavior: 'instant', block: 'center' });
 }

 connectedCallback() {
  // props가 모두 설정된 후에 실행되므로 올바른 options 값을 가져올 수 있음
  this.filteredOptions = this.options;
  this.initializeEvent(); // global dropdown Manager에 등록 + 이벤트 핸들러 초기화
 }

 disconnectedCallback() {
  this.cleanupEvent(); // global dropdown Manager에서 제거 + 이벤트 정리
 }

 protected handleDocumentClick(event: Event): void {
  console.log(event);

  if (!this.selectRef?.contains(event.target as Node)) {
   this.isOpen = false;
  }
 }

 protected handleDocumentKeydown(keyboardEvent: KeyboardEvent) {
  if (!this.isOpen) return;

  switch (keyboardEvent.key) {
   case 'ArrowDown':
   case 'ArrowUp':
    const keyboardNavigation = new SelectKeyboardNavigation(this.searchable, this.filteredOptions);
    const nextIndex = keyboardNavigation.getNextIndex(this.itemIndex, keyboardEvent.key);
    this.itemIndex = nextIndex;
    break;
   case 'Enter':
    const selectedOption = this.filteredOptions[this.itemIndex];
    this.handleOptionSelection(selectedOption);
    break;
   case 'Escape':
    this.isOpen = false;
    break;
  }
 }

 // event handlers
 handleTriggerClick = (event: Event) => {
  event.stopPropagation();

  if (!this.disabled) {
   this.isOpen = !this.isOpen;
   this.dropDownShow?.emit({ isOpen: this.isOpen });
  }
 };

 handleOptionClick = (detail: { option: SelectOption; event: Event }) => {
  const { option, event } = detail;
  event.stopPropagation();

  this.handleOptionSelection(option);
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

 private getSelectedOption(): SelectOption[] {
  return this.options.filter(option => this.value?.includes(option));
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

 private handleOptionSelection = (option: SelectOption) => {
  if (!option || option.disabled) return;

  const isAlreadySelected = this.value?.some(opt => opt.value === option.value);
  if (isAlreadySelected) {
   // 이미 선택된 옵션인 경우, 선택 해제
   this.value = this.value?.filter(opt => opt.value !== option.value) || null;
  } else {
   // 새로운 옵션 선택
   this.value = [...(this.value || []), option];
  }
 };

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
      'sd-select-multiple': true,
      'sd-select-multiple--open': this.isOpen,
      'sd-select-multiple--disabled': this.disabled,
     }}
     style={this.containerStyle}
     ref={el => (this.selectRef = el)}
    >
     {this.renderLabel(this.label, this.labelStyle)}
     <div class="sd-select-multiple__container">
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
   <label class="sd-select-multiple__label" style={labelStyle}>
    {label}
   </label>
  );
 }

 private renderTrigger() {
  const selectedOption = this.getSelectedOption();
  return (
   <div
    class="sd-select-multiple__trigger"
    tabindex={this.disabled ? -1 : 0}
    onClick={this.handleTriggerClick}
    style={this.triggerStyle}
   >
    <span class="sd-select-multiple__value">
     {!selectedOption
      ? '선택'
      : selectedOption.length
        ? selectedOption.map(option => option.label).join(', ')
        : this.placeholder}
    </span>
    {this.clearable && selectedOption?.length > 0 && !this.disabled && (
     <sd-icon
      key="close-icon"
      name="close"
      size={10}
      color="#888"
      class="sd-select-multiple__clear"
      onClick={event => {
       event.stopPropagation();
       this.value = null;
      }}
     ></sd-icon>
    )}

    <sd-icon
     key="arrow-icon"
     name="arrowDown"
     color="#888"
     class={{ 'sd-select-multiple__arrow': true, 'sd-select-multiple__arrow--open': this.isOpen }}
    ></sd-icon>
   </div>
  );
 }

 private renderDropdown() {
  if (this.isOpen === false) return null;
  return (
   <div
    class="sd-select-multiple__dropdown"
    style={this.dropdownStyle}
    onScroll={this.handleDropdownScroll}
   >
    {this.searchable && (
     <div
      class={{
       'sd-select-multiple__search-container': true,
       'sd-select-multiple__search-container--scrolled': this.isScrolled,
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
       <sd-select-option
        option={option}
        index={index}
        isSelected={this.value?.some(selected => selected.value === option.value)}
        isFocused={index === this.itemIndex}
        optionStyle={this.optionStyle}
        onOptionClick={({ detail }) => this.handleOptionClick(detail)}
        useCheckbox={this.useCheckbox}
       ></sd-select-option>
      </slot>
     ))
    ) : (
     <slot name="option-placeholder">
      <div class={'sd-select-multiple__option-placeholder'} style={this.optionStyle}>
       {this.optionPlaceholder}
      </div>
     </slot>
    )}
   </div>
  );
 }
}

{
 /* 
 <sd-select-multiple id="select-3" searchable clearable>
    <div slot="option-3">test</div>
   </sd-select-multiple>
   <sd-select-multiple id="select-4" searchable clearable use-checkbox>
    <div slot="option-4">test</div>
   </sd-select-multiple> 
   
    <script>
  document.addEventListener('DOMContentLoaded', () => {
   const select3 = document.getElementById('select-3');
   const select4 = document.getElementById('select-4');

   select1.options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
   ];

   const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true },
    { label: 'Option 4', value: '4' },
    { label: 'Option 5', value: '5' },
    { label: 'Option 6', value: '6' },
    { label: 'Option 7', value: '7', disabled: true },
    { label: 'Option 8', value: '8' },
    { label: 'Option 9', value: '9' },
    { label: 'Option 10', value: '10' },
    { label: 'Option 11', value: '11', disabled: true },
    { label: 'Option 12', value: '12' },
    { label: 'Option 13', value: '13' },
    { label: 'Option 14', value: '14' },
    { label: 'Option 15', value: '15', disabled: true },
    { label: 'Option 16', value: '16' },
    { label: 'Option 17', value: '17' },
    { label: 'Option 18', value: '18' },
    { label: 'Option 19', value: '19', disabled: true },
    { label: 'Option 20', value: '20' },
    { label: 'Option 21', value: '21' },
    { label: 'Option 22', value: '22' },
    { label: 'Option 23', value: '23', disabled: true },
    { label: 'Option 24', value: '24' },
   ];

   select3.options = options;
   select4.options = options;
  });
 </script>
   
   
   */
}
