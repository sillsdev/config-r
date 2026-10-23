import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigrPane, ConfigrPaneHandle } from './ConfigrPane';
import { ConfigrGroup, ConfigrInput, ConfigrPage, ConfigrValues } from './ContentPane';

const initialValues = { dog: { name: 'Sanuk' }, cat: { name: 'Tom' } };

// A pane with Dog, Cat and (disabled) Bird pages, or with none, whose page a test can select
// through its ref, as a client would.
function renderPane(options: {
  reported: (pageKey: string | undefined) => void;
  onChange?: (values: ConfigrValues) => void;
  initialKey?: string;
  noPages?: boolean;
}) {
  const ref = React.createRef<ConfigrPaneHandle>();
  render(
    <ConfigrPane
      ref={ref}
      label="Test"
      initialValues={initialValues}
      initiallySelectedTopLevelPageKey={options.initialKey}
      onTopLevelPageChange={options.reported}
      onChange={options.onChange}
    >
      {options.noPages
        ? []
        : [
            <ConfigrPage key="dog" label="Dog" pageKey="dog">
              <ConfigrGroup label="Dog details">
                <ConfigrInput path="dog.name" label="Dog name" />
              </ConfigrGroup>
            </ConfigrPage>,
            <ConfigrPage key="cat" label="Cat" pageKey="cat">
              <ConfigrGroup label="Cat details">
                <ConfigrInput path="cat.name" label="Cat name" />
              </ConfigrGroup>
            </ConfigrPage>,
            <ConfigrPage key="bird" label="Bird" pageKey="bird" disabled={true}>
              <ConfigrGroup label="Bird details">
                <ConfigrInput path="bird.name" label="Bird name" />
              </ConfigrGroup>
            </ConfigrPage>,
          ]}
    </ConfigrPane>,
  );
  return {
    selectPage: (key: string) => act(() => ref.current!.selectTopLevelPage(key)),
  };
}

function dogNameInput() {
  return screen.getByDisplayValue<HTMLInputElement>(/Sanuk/);
}

describe('ConfigrPane top-level page control', () => {
  afterEach(cleanup);

  it('reports the page it opens on, then each page the user clicks', () => {
    const reported = vi.fn();
    renderPane({ reported });
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('dog');

    fireEvent.click(screen.getByRole('tab', { name: 'Cat' }));
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });

  it('selects a page while mounted and keeps the values being edited', () => {
    const reported = vi.fn();
    const changed = vi.fn();
    const { selectPage } = renderPane({ reported, onChange: changed });
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

  it('ignores a key that names no page, or a disabled one', () => {
    const reported = vi.fn();
    const { selectPage } = renderPane({ reported });
    selectPage('nonesuch');
    selectPage('bird');
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('dog');
    expect(dogNameInput()).toBeTruthy();
  });

  it('still opens on initiallySelectedTopLevelPageKey', () => {
    const reported = vi.fn();
    renderPane({ reported, initialKey: 'cat' });
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith('cat');
    expect(screen.getByDisplayValue('Tom')).toBeTruthy();
  });

  it('reports no page for a pane that has none', () => {
    const reported = vi.fn();
    renderPane({ reported, noPages: true });
    expect(reported).toHaveBeenCalledTimes(1);
    expect(reported).toHaveBeenLastCalledWith(undefined);
  });
});

// A client like Bloom's dialogs: it builds its pages afresh on every render, and here re-renders
// when the button outside the pane is clicked, as it does after each edit.
function ClientWithSubPage() {
  const [, setRenders] = React.useState(0);
  return (
    <>
      <button onClick={() => setRenders((n) => n + 1)}>Re-render</button>
      <ConfigrPane
        label="Test"
        initialValues={{ dog: { name: 'Sanuk', nickname: 'Sunny' } }}
      >
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" />
            <ConfigrPage label="More" pageKey="dogMore">
              <ConfigrGroup label="More dog details">
                <ConfigrInput path="dog.nickname" label="Nickname" />
              </ConfigrGroup>
            </ConfigrPage>
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>
    </>
  );
}

describe('ConfigrPane sub-pages', () => {
  afterEach(cleanup);

  it('stays on a sub-page when the client re-renders', () => {
    render(<ClientWithSubPage />);
    expect(screen.queryByDisplayValue('Sunny')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByDisplayValue('Sunny')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Re-render' }));

    expect(screen.getByDisplayValue('Sunny')).toBeTruthy();
    expect(screen.queryByDisplayValue('Sanuk')).toBeNull();
  });
});

describe('ConfigrPane sub-pages and search', () => {
  afterEach(cleanup);

  it('leaves a sub-page of the first page when a search starts, and stays off it when it is cleared', () => {
    render(
      <ConfigrPane
        label="Test"
        showAppBar={true}
        showSearch={true}
        initialValues={{ dog: { name: 'Sanuk', nickname: 'Sunny' } }}
      >
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" />
            <ConfigrPage label="More" pageKey="dogMore">
              <ConfigrGroup label="More dog details">
                <ConfigrInput path="dog.nickname" label="Nickname" />
              </ConfigrGroup>
            </ConfigrPage>
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.queryByDisplayValue('Sanuk')).toBeNull();

    const search = screen.getByRole('textbox', { name: 'Search...' });
    fireEvent.change(search, { target: { value: 'name' } });
    fireEvent.change(search, { target: { value: '' } });

    expect(screen.getByDisplayValue('Sanuk')).toBeTruthy();
    expect(screen.queryByDisplayValue('Sunny')).toBeNull();
  });
});
