import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigrPane, ConfigrPaneHandle } from './ConfigrPane';
import { ConfigrGroup, ConfigrInput, ConfigrPage, ConfigrValues } from './ContentPane';

const initialValues = { dog: { name: 'Sanuk' }, cat: { name: 'Tom' } };

// A pane with Dog, Cat and (disabled) Bird pages, whose page a test can select through its ref,
// as a client would.
function renderPane(
  onTopLevelPageChange: (pageKey: string | undefined) => void,
  onChange?: (values: ConfigrValues) => void,
  showSearch?: boolean,
) {
  const ref = React.createRef<ConfigrPaneHandle>();
  render(
    <ConfigrPane
      ref={ref}
      label="Test"
      initialValues={initialValues}
      onTopLevelPageChange={onTopLevelPageChange}
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
    </ConfigrPane>,
  );
  if (!ref.current) throw new Error('The pane gave its ref no handle');
  const handle = ref.current;
  return { selectPage: (key: string) => act(() => handle.selectTopLevelPage(key)) };
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

  it('selects a page while mounted and keeps the values being edited', () => {
    const reported = vi.fn();
    const changed = vi.fn();
    const { selectPage } = renderPane(reported, changed);
    fireEvent.change(dogNameInput(), { target: { value: 'Sanuk the Brave' } });
    expect(dogNameInput().value).toBe('Sanuk the Brave');

    selectPage('cat');
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
    const { selectPage } = renderPane(reported);
    selectPage('cat');
    fireEvent.click(screen.getByRole('tab', { name: 'Dog' }));
    expect(reported).toHaveBeenLastCalledWith('dog');

    selectPage('cat');
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });

  it('ignores a key that names no page, or a disabled one', () => {
    const reported = vi.fn();
    const { selectPage } = renderPane(reported);
    selectPage('nonesuch');
    selectPage('bird');
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('dog');
    expect(dogNameInput()).toBeTruthy();
  });

  it('ends a search when it selects a page, as clicking a tab does', () => {
    const reported = vi.fn();
    const { selectPage } = renderPane(reported, undefined, true);
    const searchBox = screen.getByRole<HTMLInputElement>('textbox', {
      name: 'Search...',
    });
    fireEvent.change(searchBox, { target: { value: 'name' } });
    expect(searchBox.value).toBe('name');
    expect(reported).toHaveBeenLastCalledWith(undefined);

    selectPage('cat');
    expect(searchBox.value).toBe('');
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
    expect(screen.queryByDisplayValue(/Sanuk/)).toBeNull();
  });

  it('gives a callback ref one handle, which follows changes to the pages', () => {
    const handles: (ConfigrPaneHandle | null)[] = [];
    const callbackRef = (handle: ConfigrPaneHandle | null) => handles.push(handle);
    const pane = (catFirst: boolean) => {
      const dog = (
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" />
          </ConfigrGroup>
        </ConfigrPage>
      );
      const cat = (
        <ConfigrPage key="cat" label="Cat" pageKey="cat">
          <ConfigrGroup label="Cat details">
            <ConfigrInput path="cat.name" label="Cat name" />
          </ConfigrGroup>
        </ConfigrPage>
      );
      return (
        <ConfigrPane ref={callbackRef} label="Test" initialValues={initialValues}>
          {catFirst ? [cat, dog] : [dog, cat]}
        </ConfigrPane>
      );
    };
    const { rerender } = render(pane(false));
    rerender(pane(true));
    expect(handles.length).toBe(1);

    // The pages now run Cat, Dog; asking for Dog must still show Dog.
    act(() => handles[0]!.selectTopLevelPage('dog'));
    expect(dogNameInput()).toBeTruthy();
    expect(screen.queryByDisplayValue('Tom')).toBeNull();
  });

  it('never reports a disabled page, even when asked to open on one', () => {
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
        <ConfigrPage label="Cat" pageKey="cat" disabled={true}>
          <ConfigrGroup label="Cat details">
            <ConfigrInput path="cat.name" label="Cat name" />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );
    // Only the page it falls back to: not the disabled one, nor "no page" on the way.
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('dog');
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
