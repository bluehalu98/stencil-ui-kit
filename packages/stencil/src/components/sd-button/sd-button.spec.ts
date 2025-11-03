import { newSpecPage } from '@stencil/core/testing';
import { SdButton } from './sd-button';

describe('sd-button', () => {
 it('renders with default props', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button>Button Text</sd-button>`,
  });

  const button = page.root?.shadowRoot?.querySelector('button');
  expect(button).toBeTruthy();
  expect(button?.classList.contains('sd-button--primary')).toBe(true);
  expect(button?.classList.contains('sd-button--sm')).toBe(true);
  expect(button?.getAttribute('type')).toBe('button');
 });

 it('renders with custom variant', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button variant="outline">Button Text</sd-button>`,
  });

  const button = page.root?.shadowRoot?.querySelector('button');
  expect(button?.classList.contains('sd-button--outline')).toBe(true);
 });

 it('renders with custom size', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button size="lg">Button Text</sd-button>`,
  });

  const button = page.root?.shadowRoot?.querySelector('button');
  expect(button?.classList.contains('sd-button--lg')).toBe(true);
 });

 it('renders with custom color variable', async () => {
  const customColor = '#ff0000';
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button color="${customColor}">Color Test</sd-button>`,
  });

  const button = page.root?.shadowRoot?.querySelector('button');
  expect(button?.style.getPropertyValue('--button-color')).toBe(customColor);
 });

 it('renders as disabled', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button disabled>Button Text</sd-button>`,
  });

  const button = page.root?.shadowRoot?.querySelector('button');
  expect(button?.disabled).toBe(true);
  expect(button?.classList.contains('sd-button--disabled')).toBe(true);
 });

 it('emits sdClick event when clicked', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button>Clickable</sd-button>`,
  });

  const button = page.root?.shadowRoot?.querySelector('button');
  const spy = jest.fn();
  page.root?.addEventListener('sdClick', spy);

  button?.click();
  await page.waitForChanges();

  expect(spy).toHaveBeenCalledTimes(1);
 });

 it('does not emit sdClick event when disabled', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button disabled>Disabled</sd-button>`,
  });

  const spy = jest.fn();
  page.root?.addEventListener('sdClick', spy);

  const instance = page.rootInstance as SdButton;
  const mockEvent = new MouseEvent('click');

  instance['handleClick'](mockEvent);
  expect(spy).not.toHaveBeenCalled();
 });

 it('renders label via prop or slot', async () => {
  const page = await newSpecPage({
   components: [SdButton],
   html: `<sd-button label="Submit"></sd-button>`,
  });

  const content = page.root?.shadowRoot?.querySelector('.sd-button__content');
  expect(content?.textContent?.trim()).toBe('Submit');
 });

 it('applies correct CSS classes for all variants', async () => {
  const variants: SdButton['variant'][] = ['primary', 'outline', 'ghost'];

  for (const variant of variants) {
   const page = await newSpecPage({
    components: [SdButton],
    html: `<sd-button variant="${variant}">Button Text</sd-button>`,
   });

   const button = page.root?.shadowRoot?.querySelector('button');
   expect(button?.classList.contains(`sd-button--${variant}`)).toBe(true);
  }
 });

 it('applies correct CSS classes for all sizes', async () => {
  const sizes: SdButton['size'][] = ['xs', 'sm', 'md', 'lg'];

  for (const size of sizes) {
   const page = await newSpecPage({
    components: [SdButton],
    html: `<sd-button size="${size}">Button Text</sd-button>`,
   });

   const button = page.root?.shadowRoot?.querySelector('button');
   expect(button?.classList.contains(`sd-button--${size}`)).toBe(true);
  }
 });
});
