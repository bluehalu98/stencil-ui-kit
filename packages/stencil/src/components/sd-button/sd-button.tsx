import { Component, Prop, h, Element, Event, EventEmitter } from '@stencil/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const ICON_SIZES: { [key in ButtonSize]: number } = {
 xs: 12,
 sm: 16,
 md: 20,
 lg: 24,
};

@Component({
 tag: 'sd-button',
 styleUrl: 'sd-button.scss',
 shadow: true,
})
export class SdButton {
 @Element() el!: HTMLElement;

 @Prop() variant?: ButtonVariant = 'primary';
 @Prop() size: ButtonSize = 'sm';
 @Prop() color: string = '#025497';
 @Prop() label: string = '';
 @Prop() disabled: boolean = false;
 @Prop() type: 'button' | 'submit' | 'reset' = 'button';
 @Prop() icon?: IconName;
 @Prop() iconRight?: IconName;
 @Prop() noHover: boolean = false;

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

  if (!this.label && (this.icon || this.iconRight)) {
   classes.push('sd-button--icon-only');
  }

  if (this.noHover) {
   classes.push('sd-button--no-hover');
  }

  return classes.join(' ');
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
    <div class="sd-button__content">
     {this.icon && (
      <sd-icon
       class="sd-button__icon sd-button__icon--left"
       name={this.icon}
       size={ICON_SIZES[this.size!]}
       color={this.variant === 'primary' ? '#fff' : this.color}
      ></sd-icon>
     )}

     {this.label && <div class="sd-button__label">{this.label}</div>}

     {this.iconRight && (
      <sd-icon
       class="sd-button__icon sd-button__icon--right"
       name={this.iconRight}
       size={ICON_SIZES[this.size!]}
       color={this.variant === 'primary' ? '#fff' : this.color}
      ></sd-icon>
     )}
    </div>
   </button>
  );
 }
}
