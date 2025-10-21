/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer, type StencilVueComponent } from '@stencil/vue-output-target/runtime';

import type { JSX } from '../../../dist/types/components';

export const SdButton: StencilVueComponent<JSX.SdButton> =
 /*@__PURE__*/ defineContainer<JSX.SdButton>(
  'sd-button',
  undefined,
  ['variant', 'size', 'color', 'label', 'disabled', 'type', 'sdClick'],
  ['sdClick'],
 );

export const SdInput: StencilVueComponent<JSX.SdInput> = /*@__PURE__*/ defineContainer<JSX.SdInput>(
 'sd-input',
 undefined,
 [
  'value',
  'label',
  'placeholder',
  'disabled',
  'clearable',
  'width',
  'barcode',
  'rules',
  'onInput',
  'onChange',
 ],
 ['onInput', 'onChange'],
);

export const SdSelect: StencilVueComponent<JSX.SdSelect> =
 /*@__PURE__*/ defineContainer<JSX.SdSelect>(
  'sd-select',
  undefined,
  [
   'value',
   'label',
   'options',
   'placeholder',
   'width',
   'disabled',
   'clearable',
   'searchable',
   'containerStyle',
   'triggerStyle',
   'dropdownStyle',
   'optionStyle',
   'labelStyle',
   'valueChanged',
   'dropDownShow',
  ],
  ['valueChanged', 'dropDownShow'],
 );

export const SdTag: StencilVueComponent<JSX.SdTag> = /*@__PURE__*/ defineContainer<JSX.SdTag>(
 'sd-tag',
 undefined,
 ['size', 'color', 'rounded', 'label', 'bgColor', 'textColor'],
);
