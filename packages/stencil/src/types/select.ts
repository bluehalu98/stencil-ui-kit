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
