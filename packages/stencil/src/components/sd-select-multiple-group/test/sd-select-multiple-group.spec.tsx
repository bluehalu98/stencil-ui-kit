import { newSpecPage } from '@stencil/core/testing';
import { SdSelectMultipleGroup } from '../sd-select-multiple-group';

describe('sd-select-multiple-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SdSelectMultipleGroup],
      html: `<sd-select-multiple-group></sd-select-multiple-group>`,
    });
    expect(page.root).toEqualHtml(`
      <sd-select-multiple-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sd-select-multiple-group>
    `);
  });
});
