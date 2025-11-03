import { newE2EPage } from '@stencil/core/testing';

describe('sd-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sd-select></sd-select>');

    const element = await page.find('sd-select');
    expect(element).toHaveClass('hydrated');
  });
});
