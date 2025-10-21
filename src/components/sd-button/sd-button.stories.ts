import type { Meta, StoryObj } from '@storybook/web-components';

// 빌드된 컴포넌트를 로드
import '../../../dist/design-system/design-system.esm.js';

const meta: Meta = {
 title: 'Components/Button',
 component: 'sd-button',
 tags: ['autodocs'],
 argTypes: {
  variant: {
   control: 'select',
   options: ['primary', 'outline', 'ghost'],
   description: '버튼 스타일 변형',
  },
  size: {
   control: 'select',
   options: ['xs', 'sm', 'md', 'lg'],
   description: '버튼 크기',
  },
  color: {
   control: 'color',
   description: '버튼 색상 (CSS 변수로 전달됨)',
  },
  disabled: {
   control: 'boolean',
   description: '비활성화 상태',
  },
  label: {
   control: 'text',
   description: '버튼 안의 텍스트',
  },
  sdClick: { action: 'clicked', table: { disable: true } },
 },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
 args: {
  variant: 'primary',
  size: 'md',
  label: 'Primary Button',
 },
};

export const Outline: Story = {
 args: {
  variant: 'outline',
  size: 'md',
  label: 'Outline Button',
 },
};

export const Ghost: Story = {
 args: {
  variant: 'ghost',
  size: 'md',
  label: 'Ghost Button',
 },
};

export const Disabled: Story = {
 args: {
  variant: 'primary',
  size: 'md',
  disabled: true,
  label: 'Disabled Button',
 },
};
