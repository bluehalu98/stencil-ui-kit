import { Component, Prop, h, Element, Event, EventEmitter } from '@stencil/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
 tag: 'sd-button',
 styleUrl: 'sd-button.scss',
 shadow: true,
})
export class SdButton {
 @Element() el!: HTMLElement;

 @Prop() variant?: ButtonVariant = 'primary';
 @Prop() size?: ButtonSize = 'sm';
 @Prop() color?: string = '#025497';
 @Prop() label?: string = '';
 @Prop() disabled?: boolean = false;
 @Prop() type?: 'button' | 'submit' | 'reset' = 'button';

 @Event() sdClick!: EventEmitter<MouseEvent>;

 private handleClick = (event: MouseEvent) => {
  if (this.disabled) {
   event.preventDefault();
   event.stopPropagation();
   return;
  }
  this.sdClick.emit(event);
 };

 private getButtonClasses(): string {
  const classes = ['sd-button'];

  classes.push(`sd-button--${this.variant}`);
  classes.push(`sd-button--${this.size}`);
  classes.push(`sd-button--color-${this.color}`);

  if (this.disabled) {
   classes.push('sd-button--disabled');
  }

  return classes.join(' ');
 }

 private renderContent() {
  return [
   <span class="sd-button__content">
    <slot>{this.label}</slot>
   </span>,
  ];
 }

 render() {
  const buttonClasses = this.getButtonClasses();

  return (
   <button
    class={buttonClasses}
    type={this.type}
    disabled={this.disabled}
    onClick={this.handleClick}
    style={{ '--button-color': this.color }}
   >
    {this.renderContent()}
   </button>
  );
 }
}
