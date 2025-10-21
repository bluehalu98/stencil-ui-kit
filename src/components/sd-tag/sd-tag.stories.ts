import type { Meta, StoryObj } from '@storybook/web-components';

// 빌드된 컴포넌트를 로드
import '../../../dist/design-system/design-system.esm.js';

const meta: Meta = {
 title: 'Components/Tag',
 component: 'sd-tag',
 tags: ['autodocs'],
 argTypes: {
  size: {
   control: 'select',
   options: ['sm', 'md', 'lg'],
   description: '태그 크기',
   defaultValue: 'md',
  },
  color: {
   control: 'select',
   options: ['grey', 'red', 'orange', 'yellow', 'green', 'blue', 'darkblue', 'indigo'],
   description: '태그 색상',
   defaultValue: 'grey',
  },
  rounded: {
   control: 'boolean',
   description: '둥근 모서리 적용 여부',
   defaultValue: false,
  },
  label: {
   control: 'text',
   description: '태그 텍스트',
   defaultValue: '',
  },
  bgColor: {
   control: 'color',
   description: '사용자 지정 배경색',
  },
  textColor: {
   control: 'color',
   description: '사용자 지정 텍스트 색상',
  },
 },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
 args: {
  label: 'Tag',
  size: 'md',
 },
};

function renderTagList(size: string, label: string) {
 return `
  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
   ${['grey', 'red', 'orange', 'yellow', 'green', 'blue', 'darkblue', 'indigo']
    .map(color => `<sd-tag color="${color}" size="${size}" label="${label}"></sd-tag>`)
    .join('')}
  </div>
 `;
}

export const SmSize: Story = {
 render: args => renderTagList(args.size, args.label),
 args: {
  label: 'Tag',
  size: 'sm',
 },
};

export const MdSize: Story = {
 render: args => renderTagList(args.size, args.label),
 args: {
  label: 'Tag',
  size: 'md',
 },
};

export const LgSize: Story = {
 render: args => renderTagList(args.size, args.label),
 args: {
  label: 'Tag',
  size: 'lg',
 },
};

export const Rounded: Story = {
 render: args => `
  ${['sm', 'md', 'lg']
   .map(
    size => `
     <sd-tag color="${args.color}" size="${size}" label="${args.label}" rounded="${args.rounded}"></sd-tag>
    `,
   )
   .join('')}
 `,
 args: {
  label: 'Tag',
  size: 'lg',
  color: 'blue',
  rounded: true,
 },
};

export const CustomColor: Story = {
 args: {
  label: 'Tag',
  size: 'md',
  bgColor: '#E0F7FA',
  textColor: '#00796B',
 },
};
