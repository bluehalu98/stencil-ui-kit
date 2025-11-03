import type { Meta, StoryObj } from '@storybook/web-components';

import '../../../dist/stencil-test/stencil-test.esm.js';

const meta: Meta = {
 title: 'Components/DatePicker',
 component: 'sd-date-picker',
 tags: ['autodocs'],
 argTypes: {
  date: { control: 'text' },
  label: { control: 'text' },
  selectable: { control: 'object' },
  disabled: { control: 'boolean' },
 },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
 args: {
  date: '2025-10-30',
  label: '',
  selectable: ['2025-10-07', '2026-10-31'],
  disabled: false,
 },
};

export const Disabled: Story = {
 args: {
  date: '2025-10-30',
  selectable: ['2026-10-01', '2026-10-31'],
  disabled: true,
 },
};

export const WithLabel: Story = {
 args: {
  date: '2025-10-30',
  label: '날짜 선택',
  selectable: ['2025-10-07', '2026-10-31'],
  disabled: false,
 },
};
