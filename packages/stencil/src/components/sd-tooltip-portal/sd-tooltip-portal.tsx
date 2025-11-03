import { Component, Element, Event, EventEmitter, Listen, Prop, h } from '@stencil/core';

@Component({
 tag: 'sd-tooltip-portal',
 shadow: true,
})
export class SdTooltipPortal {
 @Element() el!: HTMLElement;
 @Prop() to: HTMLElement | string = 'body';
 @Prop() parentRef: HTMLElement | null = null;
 @Prop() offset: [number, number] = [0, 0];
 @Prop() zIndex: number = 9999;
 @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
 @Prop() open: boolean = false;

 @Event() sdClose!: EventEmitter<void>;

 private container?: HTMLElement;
 private wrapper?: HTMLElement;
 private rafId?: number;
 private isInsideClick = false;

 private resizeObserver?: ResizeObserver;
 private mutationObserver?: MutationObserver;

 private static readonly ARROW_SIZE = 11.2;

 componentDidLoad() {
  this.container = this.resolveContainer();
  this.createWrapper();
  this.moveSlotContent();

  // DOM이 완전히 렌더링된 후 위치 계산
  requestAnimationFrame(() => {
   this.updatePosition();
   if (this.wrapper) {
    this.wrapper.style.visibility = 'visible'; // 위치 계산 후 표시
   }
  });

  this.observeParent();
 }

 componentDidRender() {
  if (!this.wrapper) return;

  // this.wrapper.style.display = this.open ? 'block' : 'none';
  // if (this.open) this.updatePosition();

  if (this.open) {
   this.wrapper.style.display = 'block';
   // RAF를 사용해서 다음 프레임에 위치 업데이트
   requestAnimationFrame(() => {
    this.updatePosition();
    if (this.wrapper) {
     this.wrapper.style.visibility = 'visible';
    }
   });
  } else {
   this.wrapper.style.display = 'none';
   this.wrapper.style.visibility = 'hidden';
  }
 }

 disconnectedCallback() {
  if (this.rafId) cancelAnimationFrame(this.rafId);
  this.unobserveParent();
  this.wrapper?.remove();
 }

 private resolveContainer(): HTMLElement {
  const el = typeof this.to === 'string' ? document.querySelector(this.to) : this.to;
  return el instanceof HTMLElement ? el : document.body;
 }

 private createWrapper() {
  this.wrapper = document.createElement('div');
  Object.assign(this.wrapper.style, {
   position: 'absolute',
   zIndex: this.zIndex.toString(),
   transition: 'opacity 0.4s',
   top: '-9999px',
   left: '-9999px',
  });
  this.container!.appendChild(this.wrapper);
 }

 private moveSlotContent() {
  if (!this.wrapper) return;
  const nodes = Array.from(this.el.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE);
  nodes.forEach(n => this.wrapper!.appendChild(n));
 }

 // 위치 갱신 (scroll / resize)
 @Listen('scroll', { target: 'window' })
 @Listen('resize', { target: 'window' })
 updatePosition() {
  if (this.rafId) cancelAnimationFrame(this.rafId);

  this.rafId = requestAnimationFrame(() => {
   if (!this.parentRef || !this.wrapper) return;

   const rect = this.parentRef.getBoundingClientRect();
   if (!rect.width && !rect.height) return; // 요소가 보이지 않는 경우

   const [offsetX, offsetY] = this.offset;
   const ARROW_SIZE = SdTooltipPortal.ARROW_SIZE;

   let top = 0;
   let left = 0;

   switch (this.placement) {
    case 'top':
     top = rect.top + window.scrollY - this.wrapper.offsetHeight + offsetY - ARROW_SIZE;
     left = rect.left + window.scrollX + rect.width / 2 - this.wrapper.offsetWidth / 2 + offsetX;
     break;

    case 'bottom':
     top = rect.bottom + window.scrollY + offsetY + ARROW_SIZE;
     left = rect.left + window.scrollX + rect.width / 2 - this.wrapper.offsetWidth / 2 + offsetX;
     break;

    case 'left':
     top = rect.top + window.scrollY + rect.height / 2 - this.wrapper.offsetHeight / 2 + offsetY;
     left = rect.left + window.scrollX - this.wrapper.offsetWidth - offsetX - ARROW_SIZE;
     break;

    case 'right':
     top = rect.top + window.scrollY + rect.height / 2 - this.wrapper.offsetHeight / 2 + offsetY;
     left = rect.right + window.scrollX + offsetX + ARROW_SIZE;
     break;
   }

   Object.assign(this.wrapper!.style, {
    top: `${top}px`,
    left: `${left}px`,
   });
  });
 }

 // parentRef의 이동 / 크기변경 감지
 private observeParent() {
  if (!this.parentRef) return;

  this.resizeObserver = new ResizeObserver(() => this.updatePosition());
  this.resizeObserver.observe(this.parentRef);

  this.mutationObserver = new MutationObserver(() => this.updatePosition());
  this.mutationObserver.observe(document.body, {
   childList: true,
   subtree: true,
  });
 }

 private unobserveParent() {
  this.resizeObserver?.disconnect();
  this.mutationObserver?.disconnect();
 }

 // 외부 클릭 감지
 @Listen('mousedown', { target: 'window' })
 handleMouseDown(e: MouseEvent) {
  this.isInsideClick = !!(this.wrapper && this.wrapper.contains(e.target as Node));
 }

 @Listen('click', { target: 'window' })
 handleWindowClick(e: MouseEvent) {
  if (this.isInsideClick) {
   this.isInsideClick = false;
   return;
  }
  if (this.wrapper?.contains(e.target as Node)) return;
  this.sdClose.emit();
 }

 render() {
  return <slot></slot>;
 }
}
