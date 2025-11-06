import { newE2EPage } from '@stencil/core/testing';

describe('sd-select-multiple', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sd-select-multiple></sd-select-multiple>');

    const element = await page.find('sd-select-multiple');
    expect(element).toHaveClass('hydrated');
  });
});
