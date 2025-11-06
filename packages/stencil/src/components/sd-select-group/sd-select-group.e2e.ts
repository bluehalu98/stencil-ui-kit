import { newE2EPage } from '@stencil/core/testing';

describe('sd-select-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sd-select-group></sd-select-group>');

    const element = await page.find('sd-select-group');
    expect(element).toHaveClass('hydrated');
  });
});
