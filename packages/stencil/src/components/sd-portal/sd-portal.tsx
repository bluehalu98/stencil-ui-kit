import { Component, Element, Event, EventEmitter, Listen, Prop, h } from '@stencil/core';

@Component({
 tag: 'sd-portal',
 shadow: false,
})
export class SdPortal {
 @Element() hostEl!: HTMLElement;
 @Prop() to: HTMLElement | string = 'body';
 @Prop() parentRef: HTMLElement | null = null;
 @Prop() offset: [number, number] = [0, 4];
 @Prop() zIndex: number = 9999;
 @Prop() open: boolean = false;

 @Event() sdClose!: EventEmitter<void>;

 private container?: HTMLElement;
 private wrapper?: HTMLElement;
 private rafId?: number;
 private isInsideClick = false;

 private resizeObserver?: ResizeObserver;
 private mutationObserver?: MutationObserver;

 componentDidLoad() {
  this.container = this.resolveContainer();
  this.createWrapper();
  this.moveSlotContent();
  this.updatePosition();
  this.observeParent();
 }

 componentDidRender() {
  if (!this.wrapper) return;
  this.wrapper.style.display = this.open ? 'block' : 'none';
  if (this.open) this.updatePosition();
 }

 disconnectedCallback() {
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
  });
  this.container!.appendChild(this.wrapper);
 }

 private moveSlotContent() {
  if (!this.wrapper) return;
  const nodes = Array.from(this.hostEl.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE);
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
   this.wrapper.style.top = `${rect.bottom + window.scrollY + this.offset[1]}px`;
   this.wrapper.style.left = `${rect.left + window.scrollX + this.offset[0]}px`;
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
