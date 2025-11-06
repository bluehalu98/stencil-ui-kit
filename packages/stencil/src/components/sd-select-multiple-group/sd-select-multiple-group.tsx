import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sd-select-multiple-group',
  styleUrl: 'sd-select-multiple-group.scss',
  shadow: true,
})
export class SdSelectMultipleGroup {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
