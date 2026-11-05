import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConfigrPane, ConfigrPaneHandle } from './ConfigrPane';
import {
  ConfigrGroup,
  ConfigrInput,
  ConfigrPage,
  ConfigrValues,
  useConfigrValue,
} from './ContentPane';

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

describe('ConfigrGroup description', () => {
  afterEach(cleanup);

  it('shows the description under the group heading, before the rows', () => {
    render(
      <ConfigrPane label="Test" initialValues={initialValues}>
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup
            label="Dog details"
            description="Only the name shows on the collar."
          >
            <ConfigrInput path="dog.name" label="Dog name" />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );

    const heading = screen.getByText('Dog details');
    const description = screen.getByText('Only the name shows on the collar.');
    const following = (a: Node, b: Node) =>
      (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    expect(following(heading, description)).toBe(true);
    expect(following(description, dogNameInput())).toBe(true);
  });
});

describe('ConfigrGroup headerAction', () => {
  afterEach(cleanup);

  // Like Bloom's Remove button on a language group: it clears the value its group edits.
  function ClearDogName() {
    const [name, setName] = useConfigrValue<string | null>('dog.name');
    return (
      <button type="button" disabled={name === null} onClick={() => setName(null)}>
        Remove
      </button>
    );
  }

  it('shows the action on the heading line, and its change is reported like an edit', () => {
    const changed = vi.fn();
    render(
      <ConfigrPane label="Test" initialValues={initialValues} onChange={changed}>
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details" headerAction={<ClearDogName />}>
            <ConfigrInput path="dog.name" label="Dog name" />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );

    const heading = screen.getByText('Dog details');
    const remove = screen.getByRole('button', { name: 'Remove' });
    expect(heading.parentElement).toBe(remove.parentElement);
    expect(
      heading.compareDocumentPosition(dogNameInput()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(remove);
    expect(changed).toHaveBeenLastCalledWith({
      dog: { name: null },
      cat: { name: 'Tom' },
    });
    expect(remove.hasAttribute('disabled')).toBe(true);
  });

  it('leaves the heading as it was when there is no action', () => {
    render(
      <ConfigrPane label="Test" initialValues={initialValues}>
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );
    expect(screen.getByText('Dog details').tagName).toBe('H3');
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull();
  });
});

describe('description markdown', () => {
  afterEach(cleanup);

  function renderDescription(description: string) {
    render(
      <ConfigrPane label="Test" initialValues={initialValues}>
        <ConfigrPage key="dog" label="Dog" pageKey="dog">
          <ConfigrGroup label="Dog details">
            <ConfigrInput path="dog.name" label="Dog name" description={description} />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>,
    );
  }

  it('makes **text** bold, alongside links', () => {
    renderDescription(
      'If you are not **SURE**, then do not turn this on. You will **KNOW**. See [help](https://example.org).',
    );
    const sure = screen.getByText('SURE');
    expect(sure.tagName).toBe('STRONG');
    expect(screen.getByText('KNOW').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'help' }).getAttribute('href')).toBe(
      'https://example.org',
    );
    expect(sure.parentElement!.textContent).toBe(
      'If you are not SURE, then do not turn this on. You will KNOW. See help.',
    );
  });

  it('makes *text* italic, alongside bold', () => {
    renderDescription('This is *really* important, and **this** too.');
    const really = screen.getByText('really');
    expect(really.tagName).toBe('EM');
    expect(screen.getByText('this').tagName).toBe('STRONG');
    expect(really.parentElement!.textContent).toBe(
      'This is really important, and this too.',
    );
  });

  it('does not take spaced or in-word asterisks for italic or bold', () => {
    renderDescription('Use 2 * 3 * 4 or 2*3*4 or x**2 + y**2 or 2 ** 3 ** 4');
    expect(
      screen.getByText('Use 2 * 3 * 4 or 2*3*4 or x**2 + y**2 or 2 ** 3 ** 4'),
    ).toBeTruthy();
    expect(document.querySelector('em')).toBeNull();
    expect(document.querySelector('strong')).toBeNull();
  });

  it('nests italic inside bold, and bold inside italic', () => {
    renderDescription('**bold *italic* text** and *slanted **heavy** words*');
    const italic = screen.getByText('italic');
    expect(italic.tagName).toBe('EM');
    expect(italic.parentElement!.tagName).toBe('STRONG');
    expect(italic.parentElement!.textContent).toBe('bold italic text');
    const heavy = screen.getByText('heavy');
    expect(heavy.tagName).toBe('STRONG');
    expect(heavy.parentElement!.tagName).toBe('EM');
    expect(heavy.parentElement!.textContent).toBe('slanted heavy words');
    expect(document.body.textContent).not.toContain('*');
  });

  it('keeps a link inside bold or italic clickable', () => {
    renderDescription(
      '**See [help](https://example.org/a)** or *see [more](https://example.org/b)*',
    );
    const help = screen.getByRole('link', { name: 'help' });
    expect(help.getAttribute('href')).toBe('https://example.org/a');
    expect(help.closest('strong')).toBeTruthy();
    const more = screen.getByRole('link', { name: 'more' });
    expect(more.getAttribute('href')).toBe('https://example.org/b');
    expect(more.closest('em')).toBeTruthy();
  });

  it('leaves a lone or unmatched * as typed', () => {
    renderDescription('Use 2 * 3, or **this one');
    expect(screen.getByText('Use 2 * 3, or **this one')).toBeTruthy();
    expect(document.querySelector('strong')).toBeNull();
    expect(document.querySelector('em')).toBeNull();
  });
});
