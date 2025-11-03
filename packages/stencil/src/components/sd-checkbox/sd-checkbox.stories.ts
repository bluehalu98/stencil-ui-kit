import type { Meta, StoryObj } from '@storybook/web-components';

import '../../../dist/design-system/design-system.esm.js';

const meta: Meta = {
 title: 'Components/Checkbox',
 component: 'sd-checkbox',
 tags: ['autodocs'],
 argTypes: {
  checked: { control: 'boolean' },
  val: { control: 'text' },
  disabled: { control: 'boolean' },
  label: { control: 'text' },
 },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
 args: {
  checked: false,
  disabled: false,
  label: '체크박스',
 },
};

export const Checked: Story = {
 args: {
  checked: true,
  disabled: false,
  label: '체크박스',
 },
};

export const DisabledChecked: Story = {
 args: {
  checked: true,
  disabled: true,
  label: '체크박스',
 },
};

export const DisabledUnchecked: Story = {
 args: {
  checked: false,
  disabled: true,
  label: '체크박스',
 },
};
