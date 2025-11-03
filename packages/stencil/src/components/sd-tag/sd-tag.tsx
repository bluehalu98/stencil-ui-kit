import { Component, Prop, h, Element } from '@stencil/core';

export type TagColor =
 | 'grey'
 | 'red'
 | 'orange'
 | 'yellow'
 | 'green'
 | 'blue'
 | 'darkblue'
 | 'indigo';

export type TagSize = 'sm' | 'md' | 'lg';

const TAG_COLORS = {
 grey: 'bg-grey_20 text-grey_70',
 red: 'bg-red_15 text-red_70',
 orange: 'bg-orange_10 text-orange_65',
 yellow: 'bg-yellow_10 text-yellow_60',
 green: 'bg-green_15 text-green_70',
 blue: 'bg-brilliantblue_20 text-brilliantblue_75',
 darkblue: 'bg-oceanblue_15 text-oceanblue_70',
 indigo: 'bg-brilliantblue_10 text-brilliantblue_85',
};

@Component({
 tag: 'sd-tag',
 styleUrl: 'sd-tag.scss',
 shadow: true,
})
export class SdTag {
 @Element() el!: HTMLElement;

 @Prop() size: TagSize = 'md';
 @Prop() color: TagColor = 'grey';
 @Prop() rounded: boolean = false;
 @Prop() label: string = '';
 @Prop() bgColor?: string;
 @Prop() textColor?: string;

 private getTagClasses(): string {
  const classes = ['sd-tag', `sd-tag--${this.size}`];

  if (this.rounded) {
   classes.push('sd-tag--rounded');
  }

  if (this.color && !this.bgColor && !this.textColor) {
   classes.push(TAG_COLORS[this.color]);
  }

  if (this.bgColor || this.textColor) {
   classes.push('sd-tag--custom-color');
  }

  return classes.join(' ');
 }

 private renderContent() {
  return [
   <span class="sd-tag__content">
    <slot>{this.label}</slot>
   </span>,
  ];
 }

 render() {
  const tagClasses = this.getTagClasses();

  return (
   <span
    class={tagClasses}
    style={{
     '--tag-bg-color': this.bgColor,
     '--tag-text-color': this.textColor,
    }}
    aria-label={this.label || 'tag'}
   >
    {this.renderContent()}
   </span>
  );
 }
}
