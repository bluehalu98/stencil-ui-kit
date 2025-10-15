import { newSpecPage } from '@stencil/core/testing';
import { SdSelect } from '../sd-select';

describe('sd-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SdSelect],
      html: `<sd-select></sd-select>`,
    });
    expect(page.root).toEqualHtml(`
      <sd-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sd-select>
    `);
  });
});
