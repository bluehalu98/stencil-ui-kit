import { newE2EPage } from '@stencil/core/testing';

describe('sd-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sd-input></sd-input>');

    const element = await page.find('sd-input');
    expect(element).toHaveClass('hydrated');
  });
});
