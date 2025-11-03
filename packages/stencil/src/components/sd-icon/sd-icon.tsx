import { Component, Prop, h } from '@stencil/core';
import { Icons } from '../assets/index';

@Component({
 tag: 'sd-icon',
 styleUrl: 'sd-icon.scss',
 scoped: true,
})
export class SdIcon {
 /** 아이콘명 */
 @Prop() name!: IconName;

 /** 아이콘 크기 */
 @Prop() size: number | string = 12;

 /** 아이콘 색상 */
 @Prop() color?: string;

 /** 회전 각도 (0, 90, 180, 270) */
 @Prop() rotate?: 0 | 90 | 180 | 270;

 /** 접근성을 위한 라벨 */
 @Prop() label?: string;

 private getIconClasses(): string {
  const classes = ['sd-icon'];

  if (this.rotate) {
   classes.push(`sd-icon--rotate-${this.rotate}`);
  }

  return classes.join(' ');
 }

 render() {
  const IconComponent = (Icons as any)[this.name]?.[this.size];

  return (
   <i class={this.getIconClasses()}>
    <IconComponent color={this.color} />
   </i>
  );
 }
}
