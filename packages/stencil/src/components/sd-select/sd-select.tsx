import {
 Component,
 Event,
 EventEmitter,
 Host,
 Prop,
 State,
 h,
 Element,
 Watch,
} from '@stencil/core';
import { BaseDropdownEvent } from '../../utils/base-dropdown-event';
import { SelectKeyboardNavigation } from '../../utils/select-keyboard-navigation';

export interface SelectOption {
 value: string | number;
 label: string;
 disabled?: boolean;
}

export interface SelectOptionGroup extends SelectOption {
 type: 'group' | 'subgroup' | 'item';
 parent?: string;
}

export interface SelectStyleProps {
 containerStyle?: { [key: string]: string };
 triggerStyle?: { [key: string]: string };
 dropdownStyle?: { [key: string]: string };
 optionStyle?: { [key: string]: string };
 labelStyle?: { [key: string]: string };
}

export interface SelectEvents {
 sdChange: {
  value: string | number | null;
  option: SelectOption | null;
 };
 dropDownShow: { isOpen: boolean };
}

export interface SelectMultipleEvents extends Pick<SelectEvents, 'dropDownShow' | 'dropDownShow'> {
 sdChange: SelectOption[] | null;
}

@Component({
 tag: 'sd-select',
 styleUrl: 'sd-select.scss',
})
export class SdSelect extends BaseDropdownEvent {
 @Element() el!: HTMLElement;

 // props
 @Prop({ mutable: true }) value: string | number | null = null;
 @Prop() label: string = '';
 @Prop({ mutable: true }) options: SelectOption[] = [];
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
 private optionRef?: HTMLSdSelectOptionElement;
 private dropdownRef?: HTMLElement;

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

  const optionElements =
   this.dropdownRef?.querySelectorAll('.sd-select__dropdown sd-select-option') || [];
  const currentItem = optionElements?.[this.itemIndex];

  if (!currentItem || !this.isOpen) return;

  this.optionRef = currentItem as HTMLSdSelectOptionElement;
  const isOptionDisabled = await this.optionRef.isDisabled();

  if (isOptionDisabled) {
   newIndex > oldIndex ? this.itemIndex++ : this.itemIndex--;
   return;
  }

  this.scrollToOption(currentItem as HTMLElement);
 }

 componentWillLoad() {
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
   this.itemIndex = /* this.searchable ?  */ -1 /* : 0 */;
  } else {
   this.itemIndex = this.options.indexOf(selectedOption);
  }

  this.dropDownShow?.emit({ isOpen: this.isOpen });

  if (this.isOpen === false) return;

  await new Promise(resolve => setTimeout(resolve, 10));

  const optionElements =
   this.dropdownRef?.querySelectorAll('.sd-select__dropdown sd-select-option') || [];

  const currentItem = optionElements?.[this.itemIndex];

  if (this.searchable) {
   const searchInput = await this.getNativeInputElement();
   searchInput?.focus();
  }

  if (!currentItem) return;

  await new Promise(resolve => setTimeout(resolve, 10));
  this.scrollToOption(currentItem as HTMLElement);
 }

 protected handleDocumentClick(event: Event): void {
  if (!this.selectRef?.contains(event.target as Node)) {
   this.isOpen = false;
  }
 }

 protected handleDocumentKeydown(keyboardEvent: KeyboardEvent): void {
  keyboardEvent.stopPropagation();
  const targetKey = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
  if (!targetKey.includes(keyboardEvent.key)) return;

  keyboardEvent.preventDefault();
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

 handleOptionClick = (detail: { option: SelectOption; event: Event }) => {
  const { option, event } = detail;
  event.stopPropagation();

  if (!option.disabled) {
   this.value = option.value;
   this.isOpen = false;
  }
 };

 handleDropdownOpen = (element: HTMLElement) => {
  this.dropdownRef = element;
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

 private getSelectedOption(): SelectOption | undefined {
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

 private scrollToOption(optionElement: HTMLElement) {
  if (!this.dropdownRef || !optionElement) return;

  const dropdown = this.dropdownRef;
  const optionTop = optionElement.offsetTop;
  const optionHeight = optionElement.offsetHeight;
  const dropdownScrollTop = dropdown.scrollTop;
  const dropdownHeight = dropdown.clientHeight;

  const searchContainer = dropdown.querySelector('.sd-select__search-container');
  const searchOffset = searchContainer ? (searchContainer as HTMLElement).offsetHeight : 0;

  const visibleTop = dropdownScrollTop + searchOffset;
  const visibleBottom = dropdownScrollTop + dropdownHeight;

  if (optionTop < visibleTop) {
   dropdown.scrollTop = optionTop - searchOffset;
  } else if (optionTop + optionHeight > visibleBottom) {
   dropdown.scrollTop = optionTop + optionHeight - dropdownHeight + searchOffset;
  }
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
      'sd-select': true,
      'sd-select--open': this.isOpen,
      'sd-select--disabled': this.disabled,
     }}
     style={this.containerStyle}
     ref={el => (this.selectRef = el)}
    >
     {this.renderLabel(this.label, this.labelStyle)}
     <div class="sd-select__container">
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
   <label class="sd-select__label" style={labelStyle}>
    {label}
   </label>
  );
 }

 private renderTrigger() {
  const selectedOption = this.getSelectedOption();
  return (
   <div
    class="sd-select__trigger"
    tabindex={this.disabled ? -1 : 0}
    onClick={this.handleTriggerClick}
    style={this.triggerStyle}
   >
    <span class="sd-select__value">{selectedOption ? selectedOption.label : this.placeholder}</span>
    {this.clearable && selectedOption && !this.disabled && (
     <sd-icon
      key="clear-icon"
      name="close"
      size={10}
      color="#888"
      class="sd-select__clear"
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
     class={{ 'sd-select__arrow': true, 'sd-select__arrow--open': this.isOpen }}
    ></sd-icon>
   </div>
  );
 }

 private renderDropdown() {
  if (this.isOpen === false) return null;
  return (
   <sd-portal open={this.isOpen} parentRef={this.selectRef} onSdClose={this.closeDropdown}>
    <div
     class="sd-select__dropdown"
     style={this.dropdownStyle}
     onScroll={this.handleDropdownScroll}
     ref={el => (this.dropdownRef = el)}
    >
     {this.searchable && (
      <div
       class={{
        'sd-select__search-container': true,
        'sd-select__search-container--scrolled': this.isScrolled,
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
        <sd-icon
         name="search"
         size={16}
         color="#737373"
         style={{ marginRight: '4px' }}
         slot="prefix"
        ></sd-icon>
       </sd-input>
      </div>
     )}
     {this.filteredOptions.length > 0 ? (
      this.filteredOptions.map((option, index) => (
       <slot name={`option-${option.value}`}>
        <sd-select-option
         option={option}
         index={index}
         isSelected={option.value === this.value}
         isFocused={index === this.itemIndex}
         optionStyle={this.optionStyle}
         onOptionClick={({ detail }) => this.handleOptionClick(detail)}
        ></sd-select-option>
       </slot>
      ))
     ) : (
      <slot name="option-placeholder">
       <div class={'sd-select__option-placeholder'} style={this.optionStyle}>
        {this.optionPlaceholder}
       </div>
      </slot>
     )}
    </div>
   </sd-portal>
  );
 }
}

{
 /*
  <sd-select id="select-1">
    <!-- <div slot="option-placeholder">옵션이 없습니다.</div> -->
   </sd-select>
   <sd-select id="select-2"> </sd-select>
   <sd-select id="select-3" searchable clearable>
    <div slot="option-3">test</div>
   </sd-select>

    <script>
  document.addEventListener('DOMContentLoaded', () => {
   const select1 = document.getElementById('select-1');
   const select2 = document.getElementById('select-2');
   const select3 = document.getElementById('select-3');
   const select = document.querySelector('sd-select slot[name="option-3"]');
   select1.optionPlaceholder = 'No options available';

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

   select2.options = options;
   select3.options = options;
  });
 </script>

 */
}
