import { newE2EPage } from '@stencil/core/testing';

describe('sd-select-multiple-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sd-select-multiple-group></sd-select-multiple-group>');

    const element = await page.find('sd-select-multiple-group');
    expect(element).toHaveClass('hydrated');
  });
});
