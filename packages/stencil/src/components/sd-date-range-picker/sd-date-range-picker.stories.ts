import type { Meta, StoryObj } from '@storybook/web-components';

import '../../../dist/stencil-test/stencil-test.esm.js';

const meta: Meta = {
 title: 'Components/DateRangePicker',
 component: 'sd-date-range-picker',
 tags: ['autodocs'],
 argTypes: {
  date: { control: 'object' },
  label: { control: 'text' },
  selectable: { control: 'object' },
  maxRange: { control: 'number' },
  disabled: { control: 'boolean' },
 },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
 args: {
  date: ['2025-10-30', '2025-12-05'],
  label: '',
  selectable: ['2025-10-07', '2026-10-31'],
  disabled: false,
 },
};

export const Disabled: Story = {
 args: {
  date: ['2025-09-30', '2025-11-05'],
  selectable: ['2026-10-01', '2026-10-31'],
  disabled: true,
 },
};

export const maxRange: Story = {
 args: {
  date: ['2025-09-30', '2025-10-05'],
  selectable: ['2025-08-01', '2025-10-31'],
  maxRange: 30,
  disabled: false,
 },
};

export const WithLabel: Story = {
 args: {
  date: ['2025-05-20', '2025-07-02'],
  label: '날짜 선택',
  selectable: ['', '2025-11-31'],
  disabled: false,
 },
};

export const Blank: Story = {
 args: {
  date: ['', ''],
  disabled: false,
 },
};
