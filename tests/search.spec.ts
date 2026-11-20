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

  test('an empty search shows the selected page in full', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, '');

    await expect(pane.getByRole('heading', { name: 'Languages' })).toBeVisible();
    await expect(pane.getByText('Default Font', { exact: true }).first()).toBeVisible();
  });

  test('clearing the search restores the first page', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'harder');
    await expect(pane.getByText('Default Font', { exact: true })).toHaveCount(0);

    await page.getByRole('button', { name: 'clear search' }).click();

    await expect(pane.getByText('Default Font', { exact: true }).first()).toBeVisible();
    await expect(pane.getByText('Make it all harder', { exact: true })).toHaveCount(0);
    await expect(pane.locator('mark')).toHaveCount(0);
  });

  test('a match on a page title shows the whole page', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'location');

    await expect(pane.getByText('Country', { exact: true })).toBeVisible();
    await expect(pane.getByText('Province', { exact: true })).toBeVisible();
    await expect(pane.getByText('District', { exact: true })).toBeVisible();
  });

  test('a match on a group title shows the whole group', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'experimental features');

    await expect(
      pane.getByRole('heading', { name: 'Experimental Features' }),
    ).toBeVisible();
    await expect(pane.getByText('Team Collections', { exact: true })).toBeVisible();
    await expect(
      pane.getByText('Spreadsheet Import/Export', { exact: true }),
    ).toBeVisible();
  });

  test('a match on a sub-page title shows that sub-page', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'script settings');

    await expect(
      pane.getByText('Do not use special Asian script word breaking').first(),
    ).toBeVisible();
    await expect(pane.getByText('Line Spacing', { exact: true }).first()).toBeVisible();
  });

  test('a match in a setting description shows that setting', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'SYNCHRONIZE YOUR WORK');

    await expect(pane.getByText('Team Collections', { exact: true })).toBeVisible();
    await expect(
      pane.getByText('Spreadsheet Import/Export', { exact: true }),
    ).toHaveCount(0);
  });

  test('a match in a group description shows that group', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'where the book was made');

    await expect(pane.getByRole('heading', { name: 'Places' })).toBeVisible();
    await expect(pane.getByText('Country', { exact: true })).toBeVisible();
  });

  test('finds the label of a number-valued select option', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, '2.5');

    await expect(pane.getByText('Line Spacing', { exact: true }).first()).toBeVisible();
    await expect(
      pane.getByText('Font size when displayed in tools', { exact: true }),
    ).toHaveCount(0);
  });

  test('finds a number-valued select option that has no label', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, '26');

    await expect(
      pane.getByText('Font size when displayed in tools', { exact: true }).first(),
    ).toBeVisible();
  });

  test('finds the description of a select option', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'inside front cover');

    await expect(pane.getByText('Front/Back Matter Pack', { exact: true })).toBeVisible();
    await expect(pane.getByText('Page Numbering Style', { exact: true })).toHaveCount(0);
  });

  test('highlights matches as soon as the search starts', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'harder');

    await expect(pane.locator('mark', { hasText: /harder/i }).first()).toBeVisible();
  });

  test('says so when nothing matches', async ({ page }) => {
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'qwxzzy');

    await expect(pane.getByText('No matches', { exact: false })).toBeVisible();
  });

  test('a highlighted select can still be changed while searching', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    const pane = page.locator('#configr-pane');

    await searchFor(page, 'decimal');
    const row = pane.getByRole('listitem').filter({ hasText: 'Page Numbering Style' });
    const select = row.getByRole('button');
    await expect(select).toHaveText('Decimal');

    await select.click();
    await page.getByRole('option', { name: 'Devanagari' }).click();
    await expect(select).toHaveText('Devanagari');
    await select.click();
    await page.getByRole('option', { name: 'Decimal' }).click();
    await expect(select).toHaveText('Decimal');
    await expect(pane.locator('mark', { hasText: /decimal/i }).first()).toBeVisible();

    await page.getByRole('button', { name: 'clear search' }).click();
    await expect(pane.locator('mark')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });

  test('labels a sub-page match with the path to it, not a heading of its own', async ({
    page,
  }) => {
    const pane = page.locator('#configr-pane');

    // The taller-lines settings are on each language's "Script Settings" sub-page, in a group
    // whose label repeats the language's, which already heads the language's results.
    await searchFor(page, 'taller');

    const localLanguage = pane.getByRole('heading', {
      name: 'Local Language',
      exact: true,
    });
    await expect(localLanguage).toHaveCount(1);
    await expect(
      pane.getByRole('heading', { name: 'Script Settings', exact: true }).first(),
    ).toBeVisible();
    await expect(
      pane.getByRole('heading', { name: 'Script Settings › Local Language' }),
    ).toHaveCount(0);
  });
});

test.describe('Sub-page back button', () => {
  test('lines its arrow up with the left edge of the content below it', async ({
    page,
  }) => {
    await page.goto('/');
    const pane = page.locator('#configr-pane');
    await pane
      .getByRole('button', { name: /Script Settings/ })
      .first()
      .click();

    const arrow = await pane.locator('.configr-subpage-back-icon path').boundingBox();
    const heading = await pane.locator('h3').first().boundingBox();
    expect(arrow).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(Math.abs(arrow!.x - heading!.x)).toBeLessThanOrEqual(2);
  });
});
