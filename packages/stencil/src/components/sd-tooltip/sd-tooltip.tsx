import { Component, Element, Fragment, Prop, State, h } from '@stencil/core';
import { ButtonSize, ButtonVariant } from '../sd-button/sd-button';
import { TooltipArrow } from '../assets/tooltipArrow';

@Component({
 tag: 'sd-tooltip',
 styleUrl: 'sd-tooltip.scss',
 shadow: true,
})
export class SdTooltip {
 @Element() el!: HTMLElement;

 @Prop({ reflect: true }) trigger: 'hover' | 'click' = 'hover';
 @Prop({ reflect: true }) placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
 @Prop({ reflect: true }) color: string = '#01BB4B';

 @Prop({ reflect: true }) icon: IconName = 'helpOutline';
 @Prop({ reflect: true }) iconSize: number = 12;

 @Prop() label: string = '';
 @Prop({ reflect: true }) buttonSize: ButtonSize = 'sm';
 @Prop({ reflect: true }) buttonVariant: ButtonVariant = 'primary';

 @Prop() noHover: boolean = true;

 @Prop() useClose: boolean = false;

 @State() showTooltip: boolean = false;

 private buttonEl?: HTMLElement;

 private handleClose = () => {
  console.log('close tooltip');
  this.showTooltip = false;
 };

 render() {
  const handleTrigger =
   this.trigger === 'hover'
    ? {
       onMouseEnter: () => (this.showTooltip = true),
       onMouseLeave: () => (this.showTooltip = false),
      }
    : {
       onClick: () => (console.log('click tooltip'), (this.showTooltip = !this.showTooltip)),
      };

  return (
   <Fragment>
    {this.label ? (
     <sd-button
      ref={el => (this.buttonEl = el as unknown as HTMLElement)}
      label={this.label}
      icon={this.icon}
      size={this.buttonSize}
      color={this.color}
      variant={this.buttonVariant}
      class="sd-tooltip"
      {...handleTrigger}
     ></sd-button>
    ) : (
     <sd-icon
      ref={el => (this.buttonEl = el as unknown as HTMLElement)}
      name={this.icon}
      size={this.iconSize}
      color={this.color}
      class="sd-tooltip"
      {...handleTrigger}
     ></sd-icon>
    )}

    {this.showTooltip && (
     <sd-tooltip-portal
      parentRef={this.buttonEl}
      onSdClose={() => this.handleClose()}
      placement={this.placement}
     >
      <div
       class={{
        'sd-tooltip-menu': true,
        [`sd-tooltip-menu--${this.placement}`]: true,
        'sd-tooltip-menu--with-close': this.useClose,
       }}
      >
       <i class={`sd-tooltip-menu__arrow sd-tooltip-menu__arrow--${this.placement}`}>
        <TooltipArrow></TooltipArrow>
       </i>

       <div class="sd-tooltip-menu__content">
        <slot>{this.el.textContent}</slot>
       </div>

       {this.useClose && (
        <div class="sd-tooltip-menu__close-button">
         <button onClick={() => this.handleClose()}>
          <sd-icon name="close" size="12" color="#AAAAAA"></sd-icon>
         </button>
        </div>
       )}
      </div>
     </sd-tooltip-portal>
    )}
   </Fragment>
  );
 }
}
