import type { Meta, StoryObj } from '@storybook/web-components';

import '../../../dist/design-system/design-system.esm.js';
import { on } from 'events';

const meta: Meta = {
 title: 'Components/Popover',
 component: 'sd-popover',
 tags: ['autodocs'],
 argTypes: {
  show: {
   control: 'boolean',
   description: '팝오버 표시 여부',
   defaultValue: false,
   table: {
    type: { summary: 'boolean' },
    defaultValue: { summary: 'false' },
   },
  },
  placement: {
   control: { type: 'radio' },
   options: ['top', 'bottom', 'left', 'right'],
   description: '팝오버 표시 위치',
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
  title: {
   control: 'text',
   description: 'Popover 타이틀 (title 속성)',
   defaultValue: '',
   table: {
    type: { summary: 'string' },
    defaultValue: { summary: '""' },
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
  menuClass: {
   control: 'text',
   description: '추가 커스텀 클래스명',
   table: {
    type: { summary: 'string' },
   },
  },
 },
};

export default meta;

type Story = StoryObj;

function renderPopover(props: Record<string, any>) {
 const element = document.createElement('sd-popover');
 element.show = props.show;
 element.placement = props.placement;
 element.color = props.color;
 element.icon = props.icon;
 element.iconSize = props.iconSize;
 element.label = props.label;
 element.buttonSize = props.buttonSize;
 element.buttonVariant = props.buttonVariant;
 element.useClose = props.useClose;
 element.noHover = props.noHover;
 element.menuTitle = props.title;
 element.messages = props.messages || [];
 element.buttons = props.buttons || [];
 element.menuClass = props.menuClass || '';

 return element;
}

export const Default: Story = {
 args: {
  show: false,
  placement: 'top',
  color: '#01BB4B',
  icon: 'helpOutline',
  iconSize: 12,
  label: '',
  buttonSize: 'sm',
  buttonVariant: 'primary',
  title: 'Popover Title',
  messages: ['This is the popover body content.', 'You can add multiple lines of text here.'],
  buttons: [],
  menuClass: '',
  useClose: false,
  noHover: true,
 },
 render: args => {
  return renderPopover(args);
 },
};

export const WithLabel: Story = {
 args: {
  ...Default.args,
  label: 'Tooltip Button',
  placement: 'bottom',
 },
 render: args => {
  return renderPopover(args);
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
  return renderPopover(args);
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
  return renderPopover(args);
 },
};

export const AllPlacements: Story = {
 render: () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '20px';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.padding = '100px';

  const topProps = { ...Default.args, label: 'Top', placement: 'top' };
  const rightProps = { ...Default.args, label: 'Right', placement: 'right' };
  const bottomProps = { ...Default.args, label: 'Bottom', placement: 'bottom' };
  const leftProps = { ...Default.args, label: 'Left', placement: 'left' };

  container.appendChild(renderPopover(topProps));
  container.appendChild(renderPopover(rightProps));
  container.appendChild(renderPopover(bottomProps));
  container.appendChild(renderPopover(leftProps));

  return container;
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
  return renderPopover(args);
 },
};

export const IconSizes: Story = {
 render: () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '20px';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.padding = '50px';

  const xsProps = { ...Default.args, iconSize: 12, placement: 'top' };
  const smProps = { ...Default.args, iconSize: 16, placement: 'top' };
  const mdProps = { ...Default.args, iconSize: 20, placement: 'top' };
  const lgProps = { ...Default.args, iconSize: 24, placement: 'top' };

  container.appendChild(renderPopover(xsProps));
  container.appendChild(renderPopover(smProps));
  container.appendChild(renderPopover(mdProps));
  container.appendChild(renderPopover(lgProps));

  return container;
 },
};

export const ButtonVariants: Story = {
 render: () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '20px';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.padding = '50px';

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

  container.appendChild(renderPopover(primaryProps));
  container.appendChild(renderPopover(outlineProps));
  container.appendChild(renderPopover(ghostProps));

  return container;
 },
};

export const ButtonSizes: Story = {
 render: () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '20px';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.padding = '50px';

  const xsProps = { ...Default.args, icon: '', label: 'XS', buttonSize: 'xs', placement: 'top' };
  const smProps = { ...Default.args, icon: '', label: 'SM', buttonSize: 'sm', placement: 'top' };
  const mdProps = { ...Default.args, icon: '', label: 'MD', buttonSize: 'md', placement: 'top' };
  const lgProps = { ...Default.args, icon: '', label: 'LG', buttonSize: 'lg', placement: 'top' };

  container.appendChild(renderPopover(xsProps));
  container.appendChild(renderPopover(smProps));
  container.appendChild(renderPopover(mdProps));
  container.appendChild(renderPopover(lgProps));

  return container;
 },
};

export const WithButtons: Story = {
 args: {
  ...Default.args,
  buttons: [
   {
    label: 'Cancel',
    variant: 'ghost',
    color: '#ffffff',
    onClick: () => {
     console.log('Cancel clicked');
    },
   },
   {
    label: 'Confirm',
    onClick: () => {
     console.log('Confirm clicked');
    },
   },
  ],
 },
 render: args => {
  return renderPopover(args);
 },
};
