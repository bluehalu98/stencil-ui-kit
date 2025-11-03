import type { Meta, StoryObj } from '@storybook/web-components';

// 빌드된 컴포넌트를 로드
import '../../../dist/stencil-test/stencil-test.esm.js';

const meta: Meta = {
 title: 'Components/Select',
 component: 'sd-select',
 tags: ['autodocs'],
 argTypes: {
  value: {
   control: 'text',
   description: 'Select 값',
   defaultValue: '',
  },
  label: {
   control: 'text',
   description: 'Select 라벨',
   defaultValue: '',
  },
  placeholder: {
   control: 'text',
   description: 'placeholder 텍스트',
   defaultValue: '선택해 주세요.',
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
   description: 'Select 너비 (px)',
  },
  multiple: {
   control: 'boolean',
   description: '다중 선택 가능',
   defaultValue: false,
  },
  searchable: {
   control: 'boolean',
   description: '검색 가능',
   defaultValue: false,
  },
  options: {
   control: 'object',
   description: '선택 옵션 목록',
   defaultValue: [],
  },
  rules: {
   control: 'object',
   description: '유효성 검사 규칙',
   defaultValue: [],
  },
 },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
 args: {
  placeholder: '선택해 주세요.',
  options: [
   { value: 'option1', label: '옵션 1' },
   { value: 'option2', label: '옵션 2' },
   { value: 'option3', label: '옵션 3' },
  ],
 },
};

export const WithLabel: Story = {
 args: {
  label: '국가',
  placeholder: '국가를 선택해 주세요.',
  options: [
   { value: 'kr', label: '대한민국' },
   { value: 'us', label: '미국' },
   { value: 'jp', label: '일본' },
   { value: 'cn', label: '중국' },
  ],
 },
};

export const Disabled: Story = {
 args: {
  value: 'option1',
  disabled: true,
  options: [
   { value: 'option1', label: '선택된 옵션' },
   { value: 'option2', label: '옵션 2' },
  ],
 },
};

export const CustomWidth: Story = {
 args: {
  label: '사용자 정의 너비',
  placeholder: '400px 너비',
  width: 400,
  options: [
   { value: 'wide1', label: '넓은 옵션 1' },
   { value: 'wide2', label: '넓은 옵션 2' },
  ],
 },
};

export const Multiple: Story = {
 args: {
  placeholder: '여러 항목을 선택해 주세요.',
  multiple: true,
  options: [
   { value: 'skill1', label: 'JavaScript' },
   { value: 'skill2', label: 'TypeScript' },
   { value: 'skill3', label: 'React' },
   { value: 'skill4', label: 'Vue' },
   { value: 'skill5', label: 'Angular' },
  ],
 },
};

export const Searchable: Story = {
 args: {
  placeholder: '검색하여 선택해 주세요.',
  searchable: true,
  options: [
   { value: 'city1', label: '서울' },
   { value: 'city2', label: '부산' },
   { value: 'city3', label: '대구' },
   { value: 'city4', label: '인천' },
   { value: 'city5', label: '광주' },
   { value: 'city6', label: '대전' },
   { value: 'city7', label: '울산' },
  ],
 },
};

export const WithValidation: Story = {
 args: {
  label: '필수 선택',
  placeholder: '항목을 선택해 주세요.',
  value: '',
  options: [
   { value: 'required1', label: '옵션 1' },
   { value: 'required2', label: '옵션 2' },
  ],
  rules: [
   (value: string | number | null) => {
    return value !== null && value !== '';
   },
  ],
 },
};

export const Clearable: Story = {
 args: {
  value: 'option2',
  clearable: true,
  options: [
   { value: 'option1', label: '옵션 1' },
   { value: 'option2', label: '옵션 2' },
   { value: 'option3', label: '옵션 3' },
  ],
 },
};

export const LargeOptions: Story = {
 args: {
  placeholder: '항목을 선택해 주세요.',
  searchable: true,
  options: Array.from({ length: 100 }, (_, i) => ({
   value: `option${i + 1}`,
   label: `옵션 ${i + 1}`,
  })),
 },
};
