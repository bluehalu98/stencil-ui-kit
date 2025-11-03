import { dropdownManager } from './dropdown-manager';

// 여러 select를 동시에 사용할때에 이벤트 리스너의 등록이 충돌나는 문제를 해결하기 위한 Base class
// 각 드롭다운 컴포넌트는 이 클래스를 상속 및 구현 필요
// 기본적으로 click, keydown 추상 이벤트를 구현해야하고
// isOpen가 true일때에만 이벤트 등록 그외에는 이벤트 클리닝을 수행
// 추후 필요한 이벤트는 이곳에 추가하여 추가 구현 후 사용
// 별도로 드롭다운 전용의 Base class가 아닌 공통적으로 사용할 수 있는 Base class가 필요할지 검토 필요
export abstract class BaseDropdownEvent {
 abstract el: HTMLElement;
 abstract isOpen: boolean;
 abstract disabled?: boolean;

 private documentClickHandler?: (event: Event) => void;
 private documentKeydownHandler?: (event: KeyboardEvent) => void;

 // 컴포넌트 생명주기에서 호출할 메서드들
 protected initializeEvent() {
  dropdownManager.register(this);
  this.initializeEventHandlers();
 }

 protected cleanupEvent() {
  dropdownManager.unregister(this);
  this.cleanup();
 }

 protected initializeEventHandlers() {
  this.documentClickHandler = (event: Event) => this.handleDocumentClick(event);
  this.documentKeydownHandler = (event: KeyboardEvent) => this.handleDocumentKeydown(event);
 }

 protected addGlobalEventListeners() {
  if (this.documentClickHandler) {
   document.addEventListener('click', this.documentClickHandler);
  }
  if (this.documentKeydownHandler) {
   document.addEventListener('keydown', this.documentKeydownHandler);
  }
 }

 protected removeGlobalEventListeners() {
  if (this.documentClickHandler) {
   document.removeEventListener('click', this.documentClickHandler);
  }
  if (this.documentKeydownHandler) {
   document.removeEventListener('keydown', this.documentKeydownHandler);
  }
 }

 protected onDropdownToggle(isOpen: boolean) {
  if (isOpen && !this.disabled) {
   dropdownManager.openDropdown(this);
   this.addGlobalEventListeners();
  } else {
   this.removeGlobalEventListeners();
  }
 }

 protected cleanup() {
  this.removeGlobalEventListeners();
 }

 closeDropdown() {
  this.isOpen = false;
 }

 protected abstract handleDocumentClick(event: Event): void;
 protected abstract handleDocumentKeydown(event: KeyboardEvent): void;
}
