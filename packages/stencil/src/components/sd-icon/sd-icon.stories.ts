import type { Meta, StoryObj } from '@storybook/web-components';

import '../../../dist/stencil-test/stencil-test.esm.js';

const meta: Meta = {
 title: 'Components/Icon',
 component: 'sd-icon',
 tags: ['autodocs'],
 argTypes: {
  variant: {
   control: 'text',
   description: '아이콘명',
  },
  size: {
   control: 'text',
   description: '아이콘 크기',
  },
  color: {
   control: 'color',
   description: '아이콘 색상',
  },
  rotate: {
   control: 'select',
   options: [0, 90, 180, 270],
   description: '회전 각도',
  },
  label: {
   control: 'text',
   description: '접근성을 위한 라벨',
  },
 },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CheckIcon: Story = {
 args: {
  name: 'check',
  size: 12,
  color: '#032d40',
  label: 'checkIcon',
 },
};

export const ArrowLeftIcon: Story = {
 args: {
  name: 'arrowLeft',
  size: 12,
  color: '#aaaaaa',
  label: 'arrowLeftIcon',
 },
};
