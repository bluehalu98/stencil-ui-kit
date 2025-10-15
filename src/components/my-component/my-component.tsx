import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * label of the button
   */
  @Prop() label: string;

  /**
   * Emitted when the button is clicked
   */
  @Event() clicked: EventEmitter<void>;

  private getText(): string {
    return format(this.label);
  }

  private handleButtonClick = (): void => {
    console.log('Button clicked! from StencilJS');

    this.clicked.emit();
  };

  render() {
    return <button onClick={this.handleButtonClick}>{this.getText()}</button>;
  }
}
