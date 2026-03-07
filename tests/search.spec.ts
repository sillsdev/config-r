import { expect, Page, test } from '@playwright/test';

async function searchFor(page: Page, term: string) {
  const searchBox = page.getByRole('textbox', { name: 'search' });
  await searchBox.fill(term);
}

async function expectSearchCleared(page: Page) {
  await expect(page.getByRole('textbox', { name: 'search' })).toHaveValue('');
  await expect(page.getByRole('button', { name: 'clear search' })).toHaveCount(0);
}

test.describe('Bloom collection search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('textbox', { name: 'search' })).toBeVisible();
  });

  test('finds Bloom matches across top-level pages', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'Bloom');

    await expect(
      pane.getByText('BloomLibrary.org Bookshelf', { exact: true }),
    ).toBeVisible();
    await expect(pane.getByText('Bloom Collection Name', { exact: true })).toBeVisible();
    await expect(
      pane.getByText('Automatically Update Bloom', { exact: true }),
    ).toBeVisible();
  });

  test('can clear search with the cancel button', async ({ page }) => {
    await searchFor(page, 'Bloom');

    await page.getByRole('button', { name: 'clear search' }).click();

    await expectSearchCleared(page);
  });

  test('finds help text case-insensitively', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'kyrgyzstan');

    await expect(
      pane.getByText('This is locked by Kyrgyzstan xmatter').first(),
    ).toBeVisible();
  });

  test('finds combo box option text', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'decimal');

    await expect(pane.getByText('Page Numbering Style', { exact: true })).toBeVisible();
  });

  test('finds text matches in the Page area', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'text');

    await expect(pane.getByText('Use high-contrast text', { exact: true })).toBeVisible();
  });

  test('does not render duplicate headings or empty separators for harder', async ({
    page,
  }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'harder');

    await expect(pane.getByRole('heading', { name: 'Super Advanced' })).toHaveCount(1);
    await expect(pane.getByRole('button', { name: 'Make it all harder' })).toHaveCount(1);
    await expect(pane.locator('hr')).toHaveCount(0);
  });

  test('finds taller script settings', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'taller');

    await expect(pane.getByRole('heading', { name: 'Local Language' })).toHaveCount(1);
    await expect(
      pane.getByRole('heading', { name: 'Language 2 (e.g. National Language)' }),
    ).toHaveCount(1);
    await expect(
      pane.getByRole('heading', {
        name: 'Language 3 (e.g. Regional Language) (Optional)',
      }),
    ).toHaveCount(1);
    await expect(
      pane
        .getByText('This script requires taller lines (locked)', { exact: true })
        .first(),
    ).toBeVisible();
    await expect(
      pane.getByText('This script requires taller lines', { exact: true }).first(),
    ).toBeVisible();
  });

  test('finds nested font matches in subpages', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'font');

    await expect(
      pane.getByText('Font size when displayed in tools', { exact: true }).first(),
    ).toBeVisible();
    await expect(pane.getByRole('heading', { name: 'Fonts' })).toBeVisible();
  });
});
