import { Component, Element, Fragment, Prop, State, Watch, h } from '@stencil/core';
import { ButtonSize, ButtonVariant } from '../sd-button/sd-button';
import { TooltipArrow } from '../assets/tooltipArrow';

@Component({
 tag: 'sd-popover',
 styleUrl: 'sd-popover.scss',
 shadow: true,
})
export class SdPopover {
 @Element() el!: HTMLElement;

 @Prop({ mutable: true }) show: boolean = false;

 @Prop({ reflect: true }) placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
 @Prop({ reflect: true }) color: string = '#01BB4B';

 @Prop({ reflect: true }) icon: IconName = 'helpOutline';
 @Prop({ reflect: true }) iconSize: number = 12;

 @Prop() label: string = '';
 @Prop({ reflect: true }) buttonSize: ButtonSize = 'sm';
 @Prop({ reflect: true }) buttonVariant: ButtonVariant = 'primary';

 @Prop({ attribute: 'title', reflect: true }) menuTitle?: string;
 @Prop({ reflect: true }) messages: string[] = [];
 @Prop({ reflect: true }) buttons: {
  [key: string]: any;
 }[] = [];
 @Prop() menuClass: string = '';

 @Prop() noHover: boolean = true;

 @Prop() useClose: boolean = false;

 @State() showPopover: boolean = false;
 @State() slotContent: string = '';

 @Watch('show')
 watchShowHandler(newValue: boolean) {
  this.showPopover = newValue;
 }

 componentWillLoad() {
  this.showPopover = this.show;

  this.slotContent = this.el.innerHTML;

  console.log(this.el);
 }

 private buttonEl?: HTMLElement;

 private handleClose = () => {
  this.showPopover = false;
 };

 render() {
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
      class="sd-popover"
      onClick={() => (console.log('click popover'), (this.showPopover = !this.showPopover))}
     ></sd-button>
    ) : (
     <sd-icon
      ref={el => (this.buttonEl = el as unknown as HTMLElement)}
      name={this.icon}
      size={this.iconSize}
      color={this.color}
      class="sd-popover"
      onClick={() => (console.log('click popover'), (this.showPopover = !this.showPopover))}
     ></sd-icon>
    )}

    {this.showPopover && (
     <sd-tooltip-portal
      parentRef={this.buttonEl}
      onSdClose={this.handleClose}
      placement={this.placement}
     >
      <div
       class={{
        'sd-popover-menu': true,
        [`sd-popover-menu--${this.placement}`]: true,
        [this.menuClass]: !!this.menuClass,
       }}
      >
       <i class={`sd-popover-menu__arrow sd-popover-menu__arrow--${this.placement}`}>
        <TooltipArrow></TooltipArrow>
       </i>

       <div class="sd-popover-menu__content">
        {this.menuTitle && <div class="sd-popover-menu__title">{this.menuTitle}</div>}

        {this.messages.length > 0 && (
         <div class="sd-popover-menu__messages">
          {this.messages.map(message => (
           <div>{message}</div>
          ))}
         </div>
        )}

        {this.buttons.length > 0 && (
         <div class={`sd-popover-menu__buttons sd-popover-menu__buttons--${this.buttons.length}`}>
          {this.buttons.map(button => (
           <sd-button {...button} />
          ))}
         </div>
        )}
       </div>

       {this.useClose && (
        <button class="sd-popover-menu__close-button" onClick={() => this.handleClose()}>
         <sd-icon name="close" size="12" color="#AAAAAA"></sd-icon>
        </button>
       )}
      </div>
     </sd-tooltip-portal>
    )}
   </Fragment>
  );
 }
}
