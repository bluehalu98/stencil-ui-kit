import { BaseDropdownEvent } from './base-dropdown-event';

class DropdownManager {
 private static instance: DropdownManager;
 private activeDropdowns = new Set<BaseDropdownEvent>();

 static getInstance(): DropdownManager {
  if (!DropdownManager.instance) {
   DropdownManager.instance = new DropdownManager();
  }
  return DropdownManager.instance;
 }

 register(component: BaseDropdownEvent) {
  this.activeDropdowns.add(component);
 }

 unregister(component: BaseDropdownEvent) {
  this.activeDropdowns.delete(component);
 }

 openDropdown(targetComponent: BaseDropdownEvent) {
  // 다른 모든 드롭다운 닫기
  this.activeDropdowns.forEach(component => {
   if (component !== targetComponent && component.isOpen) {
    component.closeDropdown();
   }
  });
 }

 closeAllDropdowns() {
  this.activeDropdowns.forEach(component => {
   if (component.isOpen) {
    component.closeDropdown();
   }
  });
 }
}

export const dropdownManager = DropdownManager.getInstance();
