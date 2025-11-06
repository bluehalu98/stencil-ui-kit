import { newSpecPage } from '@stencil/core/testing';
import { SdSelectMultiple } from './sd-select-multiple';

describe('sd-select-multiple', () => {
 it('renders', async () => {
  const page = await newSpecPage({
   components: [SdSelectMultiple],
   html: `<sd-select-multiple></sd-select-multiple>`,
  });
  expect(page.root).toEqualHtml(`
      <sd-select-multiple>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sd-select-multiple>
    `);
 });
});
