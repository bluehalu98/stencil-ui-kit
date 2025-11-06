import { newSpecPage } from '@stencil/core/testing';
import { SdSelectGroup } from './sd-select-group';

describe('sd-select-group', () => {
 it('renders', async () => {
  const page = await newSpecPage({
   components: [SdSelectGroup],
   html: `<sd-select-group></sd-select-group>`,
  });
  expect(page.root).toEqualHtml(`
      <sd-select-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sd-select-group>
    `);
 });
});
