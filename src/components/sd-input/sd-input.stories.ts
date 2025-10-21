import type { Meta, StoryObj } from '@storybook/web-components';

// 빌드된 컴포넌트를 로드
import '../../../dist/design-system/design-system.esm.js';

const meta: Meta = {
 title: 'Components/Input',
 component: 'sd-input',
 tags: ['autodocs'],
 argTypes: {
  value: {
   control: 'text',
   description: 'Input 값',
   defaultValue: '',
  },
  label: {
   control: 'text',
   description: 'Input 라벨',
   defaultValue: '',
  },
  placeholder: {
   control: 'text',
   description: 'placeholder 텍스트',
   defaultValue: '입력해 주세요.',
  },
  disabled: {
   control: 'boolean',
   description: '비활성화 상태',
   defaultValue: false,
  },
  clearable: {
   control: 'boolean',
   description: '클리어 버튼 표시 여부',
   defaultValue: false,
  },
  width: {
   control: 'number',
   description: 'Input 너비 (px)',
  },
  barcode: {
   control: 'boolean',
   description: '바코드 스타일 적용',
   defaultValue: false,
  },
 },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
 args: {
  placeholder: '입력해 주세요.',
 },
};

export const WithLabel: Story = {
 args: {
  label: '이름',
  placeholder: '이름을 입력해 주세요.',
 },
};

export const Disabled: Story = {
 args: {
  label: '비활성화된 Input',
  value: '수정할 수 없는 값',
  disabled: true,
 },
};

export const CustomWidth: Story = {
 args: {
  label: '사용자 정의 너비',
  placeholder: '400px 너비',
  width: 400,
 },
};

export const Barcode: Story = {
 args: {
  label: '바코드 입력',
  placeholder: '바코드를 스캔하거나 입력해 주세요.',
  width: 200,
  barcode: true,
 },
};

export const WithValidation: Story = {
 args: {
  label: '이메일',
  placeholder: '이메일을 입력해 주세요.',
  value: 'invalid-email',
  rules: [
   (value: string | number | null) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value));
   },
  ],
 },
};
