import { newSpecPage } from '@stencil/core/testing';
import { SdInput } from '../sd-input';

describe('sd-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SdInput],
      html: `<sd-input></sd-input>`,
    });
    expect(page.root).toEqualHtml(`
      <sd-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sd-input>
    `);
  });
});
