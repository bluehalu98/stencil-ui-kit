import type { Meta, StoryObj } from '@storybook/web-components';

import '../../../dist/design-system/design-system.esm.js';

const meta: Meta = {
 title: 'Components/Tooltip',
 component: 'sd-tooltip',
 tags: ['autodocs'],
 argTypes: {
  trigger: {
   control: { type: 'radio' },
   options: ['hover', 'click'],
   description: '툴팁 트리거 방식',
   defaultValue: 'hover',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: 'hover' },
   },
  },
  placement: {
   control: { type: 'radio' },
   options: ['top', 'bottom', 'left', 'right'],
   description: '툴팁 표시 위치',
   defaultValue: 'bottom',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: 'bottom' },
   },
  },
  color: {
   control: 'color',
   description: '아이콘 또는 버튼 컬러',
   defaultValue: '#01BB4B',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: '#01BB4B' },
   },
  },
  icon: {
   control: 'text',
   description: '툴팁 아이콘 이름 (label이 없을 때 표시)',
   defaultValue: 'helpOutline',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: 'helpOutline' },
   },
  },
  iconSize: {
   control: { type: 'number', min: 8, max: 48, step: 1 },
   description: '아이콘 크기(px)',
   defaultValue: 12,
   table: {
    type: { summary: 'number' },
    defaultValue: { summary: '12' },
   },
  },
  label: {
   control: 'text',
   description: '툴팁 트리거 버튼 라벨 (있으면 버튼, 없으면 아이콘)',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: '""' },
   },
  },
  buttonSize: {
   control: { type: 'radio' },
   options: ['xs', 'sm', 'md', 'lg'],
   description: '버튼 크기 (label이 있을 때만 적용)',
   defaultValue: 'sm',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: 'sm' },
   },
  },
  buttonVariant: {
   control: { type: 'radio' },
   options: ['primary', 'outline', 'ghost'],
   description: '버튼 스타일 (label이 있을 때만 적용)',
   defaultValue: 'primary',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: 'primary' },
   },
  },
  useClose: {
   control: 'boolean',
   description: '닫기 버튼 표시 여부 (click 트리거일 때 유용)',
   defaultValue: false,
   table: {
    type: { summary: 'boolean' },
    defaultValue: { summary: 'false' },
   },
  },
  noHover: {
   control: 'boolean',
   description: 'hover 효과 제거 여부',
   defaultValue: true,
   table: {
    type: { summary: 'boolean' },
    defaultValue: { summary: 'true' },
   },
  },
 },
};

export default meta;

type Story = StoryObj;

function renderTooltip(props: Record<string, any>, content: string = '이것은 툴팁입니다.') {
 // const propsString = Object.entries(props)
 //  .map(([key, value]) => {
 //   if (typeof value === 'boolean') return value ? key : '';
 //   if (typeof value === 'string') return `${key}="${value.replace(/"/g, '&quot;')}"`;
 //   return `${key}="${value}"`;
 //  })
 //  .filter(Boolean)
 //  .join(' ')
 //  .trim();

 return `
    <sd-tooltip
    trigger="${props.trigger}"
    placement="${props.placement}"
    color="${props.color}"
    icon="${props.icon}"
    icon-size="${props['iconSize']}"
    label="${props.label}"
    button-size="${props.buttonSize}"
    button-variant="${props.buttonVariant}"
    ${props.useClose ? 'use-close' : ''}
    ${props.noHover ? 'no-hover' : ''}
    >
      ${content}
    </sd-tooltip>
  `;
}

export const Default: Story = {
 args: {
  trigger: 'hover',
  placement: 'top',
  color: '#01BB4B',
  icon: 'helpOutline',
  iconSize: 12,
  label: '',
  buttonSize: 'sm',
  buttonVariant: 'primary',
  useClose: false,
  noHover: true,
 },
 render: args => {
  return renderTooltip(args);
 },
};

export const WithLabel: Story = {
 args: {
  ...Default.args,
  label: 'Tooltip Button',
  placement: 'bottom',
 },
 render: args => {
  return renderTooltip(args);
 },
};

export const ClickTrigger: Story = {
 args: {
  ...Default.args,
  trigger: 'click',
  label: 'Click Me',
  placement: 'top',
 },
 render: args => {
  return renderTooltip(args);
 },
};

export const WithClose: Story = {
 args: {
  ...Default.args,
  trigger: 'click',
  label: 'With Close',
  useClose: true,
  placement: 'right',
 },
 render: args => {
  return renderTooltip(args);
 },
};

export const AllPlacements: Story = {
 render: () => {
  const topProps = { ...Default.args, label: 'Top', placement: 'top' };
  const rightProps = { ...Default.args, label: 'Right', placement: 'right' };
  const bottomProps = { ...Default.args, label: 'Bottom', placement: 'bottom' };
  const leftProps = { ...Default.args, label: 'Left', placement: 'left' };

  return `
   <div style="display: flex; gap: 20px; justify-content: center; align-items: center; padding: 100px;">
    ${renderTooltip(topProps, 'Top Tooltip')}
    ${renderTooltip(rightProps, 'Right Tooltip')}
    ${renderTooltip(bottomProps, 'Bottom Tooltip')}
    ${renderTooltip(leftProps, 'Left Tooltip')}
   </div>
  `;
 },
};

export const IconOnly: Story = {
 args: {
  ...Default.args,
  icon: 'helpOutline',
  iconSize: 16,
  color: '#0066CC',
  placement: 'top',
 },
 render: args => {
  return renderTooltip(args);
 },
};

export const IconSizes: Story = {
 render: () => {
  const xsProps = { ...Default.args, iconSize: '12', placement: 'top' };
  const smProps = { ...Default.args, iconSize: '16', placement: 'top' };
  const mdProps = { ...Default.args, iconSize: '20', placement: 'top' };
  const lgProps = { ...Default.args, iconSize: '24', placement: 'top' };

  return `
   <div style="display: flex; gap: 20px; justify-content: center; align-items: center; padding: 50px;">
    ${renderTooltip(xsProps, 'iconSize 12px')}
    ${renderTooltip(smProps, 'iconSize 16px')}
    ${renderTooltip(mdProps, 'iconSize 20px')}
    ${renderTooltip(lgProps, 'iconSize 24px')}
   </div>
  `;
 },
};

export const ButtonVariants: Story = {
 render: () => {
  const primaryProps = {
   ...Default.args,
   label: 'Primary',
   color: '#025497',
   buttonVariant: 'primary',
   placement: 'top',
  };
  const outlineProps = {
   ...Default.args,
   label: 'Outline',
   color: '#025497',
   buttonVariant: 'outline',
   placement: 'top',
  };
  const ghostProps = {
   ...Default.args,
   label: 'Ghost',
   color: '#025497',
   buttonVariant: 'ghost',
   placement: 'top',
  };

  return `
   <div style="display: flex; gap: 20px; justify-content: center; align-items: center; padding: 50px;">
    ${renderTooltip(primaryProps, 'Primary Button Tooltip')}
    ${renderTooltip(outlineProps, 'Outline Button Tooltip')}
    ${renderTooltip(ghostProps, 'Ghost Button Tooltip')}
   </div>
  `;
 },
};

export const ButtonSizes: Story = {
 render: () => {
  const xsProps = { ...Default.args, icon: '', label: 'XS', buttonSize: 'xs', placement: 'top' };
  const smProps = { ...Default.args, icon: '', label: 'SM', buttonSize: 'sm', placement: 'top' };
  const mdProps = { ...Default.args, icon: '', label: 'MD', buttonSize: 'md', placement: 'top' };
  const lgProps = { ...Default.args, icon: '', label: 'LG', buttonSize: 'lg', placement: 'top' };

  return `
   <div style="display: flex; gap: 20px; justify-content: center; align-items: center; padding: 50px;">
    ${renderTooltip(xsProps, 'Extra Small')}
    ${renderTooltip(smProps, 'Small')}
    ${renderTooltip(mdProps, 'Medium')}
    ${renderTooltip(lgProps, 'Large')}
   </div>
  `;
 },
};
