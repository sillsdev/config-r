import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigrPane } from './ConfigrPane';
import { ConfigrGroup, ConfigrInput, ConfigrPage, ConfigrValues } from './ContentPane';

const initialValues = { dog: { name: 'Sanuk' }, cat: { name: 'Tom' } };

// A pane with a Dog and a Cat page, whose page a test can set from outside, keeping it in step
// with what the pane reports, as a client would.
function renderPane(
  onTopLevelPageChange: (pageKey: string | undefined) => void,
  onChange?: (values: ConfigrValues) => void,
  pageKeyAtMount?: string,
  showSearch?: boolean,
) {
  let setRequestedPage: (pageKey: string | undefined) => void = () => {
    throw new Error('The harness has not rendered yet');
  };
  const Harness: React.FunctionComponent = () => {
    const [pageKey, setPageKey] = React.useState<string | undefined>(pageKeyAtMount);
    setRequestedPage = setPageKey;
    return (
      <ConfigrPane
        label="Test"
        initialValues={initialValues}
        selectedTopLevelPageKey={pageKey}
        onTopLevelPageChange={(key) => {
          onTopLevelPageChange(key);
          setPageKey(key);
        }}
        onChange={onChange}
        showAppBar={showSearch}
        showSearch={showSearch}
      >
        <ConfigrPage label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" />
          </ConfigrGroup>
        </ConfigrPage>
        <ConfigrPage label="Cat" pageKey="cat">
          <ConfigrGroup label="Cat details">
            <ConfigrInput path="cat.name" label="Cat name" />
          </ConfigrGroup>
        </ConfigrPage>
        <ConfigrPage label="Bird" pageKey="bird" disabled={true}>
          <ConfigrGroup label="Bird details">
            <ConfigrInput path="bird.name" label="Bird name" />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>
    );
  };
  render(<Harness />);
  return { requestPage: (key: string) => act(() => setRequestedPage(key)) };
}

function dogNameInput() {
  return screen.getByDisplayValue<HTMLInputElement>(/Sanuk/);
}

describe('ConfigrPane top-level page control', () => {
  afterEach(cleanup);

  it('reports the first page when it mounts', () => {
    const reported = vi.fn();
    renderPane(reported);
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('dog');
  });

  it('reports a page the user clicks', () => {
    const reported = vi.fn();
    renderPane(reported);
    fireEvent.click(screen.getByRole('tab', { name: 'Cat' }));
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });

  it('switches page while mounted and keeps the values being edited', () => {
    const reported = vi.fn();
    const changed = vi.fn();
    const { requestPage } = renderPane(reported, changed);
    fireEvent.change(dogNameInput(), { target: { value: 'Sanuk the Brave' } });
    expect(dogNameInput().value).toBe('Sanuk the Brave');

    requestPage('cat');
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
    expect(screen.queryByDisplayValue(/Sanuk/)).toBeNull();

    // Going back shows the edit, so the form was never remounted from initialValues.
    fireEvent.click(screen.getByRole('tab', { name: 'Dog' }));
    expect(dogNameInput().value).toBe('Sanuk the Brave');
    expect(changed).toHaveBeenLastCalledWith({
      dog: { name: 'Sanuk the Brave' },
      cat: { name: 'Tom' },
    });
  });

  it('selects the same page again after the user has moved away', () => {
    const reported = vi.fn();
    const { requestPage } = renderPane(reported);
    requestPage('cat');
    fireEvent.click(screen.getByRole('tab', { name: 'Dog' }));
    expect(reported).toHaveBeenLastCalledWith('dog');

    requestPage('cat');
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });

  it('ignores a key that names no page, or a disabled one', () => {
    const reported = vi.fn();
    const { requestPage } = renderPane(reported);
    requestPage('nonesuch');
    requestPage('bird');
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('dog');
    expect(dogNameInput()).toBeTruthy();
  });

  it('opens on the page the client controls from the start', () => {
    const reported = vi.fn();
    renderPane(reported, undefined, 'cat');
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });

  it('ends a search when it selects a page, as clicking a tab does', () => {
    const reported = vi.fn();
    const { requestPage } = renderPane(reported, undefined, undefined, true);
    const searchBox = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Search...',
    });
    fireEvent.change(searchBox, { target: { value: 'name' } });
    expect(searchBox.value).toBe('name');
    expect(reported).toHaveBeenLastCalledWith(undefined);

    requestPage('cat');
    expect(searchBox.value).toBe('');
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
    expect(screen.queryByDisplayValue(/Sanuk/)).toBeNull();
  });

  it('reports no page for a pane that has none', () => {
    const reported = vi.fn();
    render(
      <ConfigrPane
        label="Test"
        initialValues={initialValues}
        onTopLevelPageChange={reported}
      >
        {[]}
      </ConfigrPane>,
    );
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith(undefined);
  });

  it('still opens on initiallySelectedTopLevelPageKey', () => {
    const reported = vi.fn();
    render(
      <ConfigrPane
        label="Test"
        initialValues={initialValues}
        initiallySelectedTopLevelPageKey="cat"
        onTopLevelPageChange={reported}
      >
        <ConfigrPage label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" />
          </ConfigrGroup>
        </ConfigrPage>
        <ConfigrPage label="Cat" pageKey="cat">
          <ConfigrGroup label="Cat details">
            <ConfigrInput path="cat.name" label="Cat name" />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });
});
