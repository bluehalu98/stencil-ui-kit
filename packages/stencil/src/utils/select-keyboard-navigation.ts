import { SelectOption } from '../types/select';

export class SelectKeyboardNavigation {
 isSearchable: boolean;
 filteredOptions: SelectOption[];

 constructor(isSearchable: boolean, filteredOptions: SelectOption[]) {
  this.isSearchable = isSearchable;
  this.filteredOptions = filteredOptions;
 }

 getNavigationBounds() {
  return {
   minIndex: this.isSearchable ? -1 : 0,
   maxIndex: this.filteredOptions.length - 1,
  };
 }

 getNextIndex(currentIndex: number, direction: KeyboardEvent['key']): number {
  const { minIndex, maxIndex } = this.getNavigationBounds();

  if (direction === 'ArrowUp') {
   return currentIndex > minIndex ? currentIndex - 1 : maxIndex;
  } else {
   return currentIndex < maxIndex ? currentIndex + 1 : minIndex;
  }
 }
}
