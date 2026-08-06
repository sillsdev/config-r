// Property editor for the selected node. Driven by a per-type field descriptor table, so
// giving a new node type an editor is a data edit rather than new JSX.
import { css } from '@emotion/react';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';

import { customControlNames, customControlPropSpecs } from './customControls';
import { approximateStoredKB } from './images';
import { NodeType, ProtoNode, SelectOption, typeLabels, valueLeafTypes } from './model';
import { ProtoActions } from './store';

type FieldSpec = {
  key: keyof ProtoNode;
  label: string;
  kind: 'text' | 'multiline' | 'number' | 'checkbox' | 'enum' | 'options' | 'json';
  choices?: string[];
  /** For an enum that may legitimately be unset: the label for the blank option. */
  emptyChoiceLabel?: string;
  help?: string;
};

const kLabel: FieldSpec = { key: 'label', label: 'Label', kind: 'text' };
const kDescription: FieldSpec = {
  key: 'description',
  label: 'Description',
  kind: 'multiline',
};
const kDisabled: FieldSpec = { key: 'disabled', label: 'Disabled', kind: 'checkbox' };
const kRequired: FieldSpec = { key: 'required', label: 'Required', kind: 'checkbox' };

/** Type-specific fields. Label, path, description, note and the leaf flags are added below. */
const fieldsByType: Record<NodeType, FieldSpec[]> = {
  pane: [
    { key: 'showSearch', label: 'Show search (preview)', kind: 'checkbox' },
    { key: 'showJson', label: 'Show JSON panel (preview)', kind: 'checkbox' },
  ],
  area: [],
  page: [],
  group: [],
  subpage: [],
  // The picture itself is not editable as a field; see ImageControls below.
  image: [],
  input: [
    {
      key: 'inputType',
      label: 'Input type',
      kind: 'enum',
      choices: ['text', 'number', 'email'],
    },
    { key: 'units', label: 'Units suffix', kind: 'text' },
    { key: 'charactersWide', label: 'Characters wide', kind: 'number' },
    { key: 'defaultValue', label: 'Default value', kind: 'text' },
  ],
  boolean: [
    { key: 'immediateEffect', label: 'Immediate effect (switch)', kind: 'checkbox' },
    { key: 'locked', label: 'Locked', kind: 'checkbox' },
    { key: 'defaultValue', label: 'Default value (on)', kind: 'checkbox' },
  ],
  select: [
    { key: 'options', label: 'Options', kind: 'options' },
    { key: 'defaultValue', label: 'Default value', kind: 'text' },
  ],
  radioGroup: [
    { key: 'options', label: 'Options', kind: 'options' },
    { key: 'row', label: 'Lay out in a row', kind: 'checkbox' },
    { key: 'defaultValue', label: 'Default value', kind: 'text' },
  ],
  static: [{ key: 'text', label: 'Text', kind: 'multiline' }],
  custom: [
    {
      key: 'controlName',
      label: 'Custom control',
      kind: 'enum',
      choices: customControlNames,
      emptyChoiceLabel: '(none chosen)',
      help: 'Registered in src/prototyper/customControls.tsx',
    },
    // The control's own props render as real fields below, driven by its
    // customControlPropSpecs entry; see CustomPropsFields.
  ],
};

function specsFor(node: ProtoNode): FieldSpec[] {
  const isValueLeaf = valueLeafTypes.includes(node.type);
  return [
    kLabel,
    ...(isValueLeaf
      ? [
          {
            key: 'path' as const,
            label: 'Path',
            kind: 'text' as const,
            help: 'Where this value lives in the settings object. Stable across renames.',
          },
        ]
      : []),
    ...(node.type === 'pane' || node.type === 'area' ? [] : [kDescription]),
    ...fieldsByType[node.type],
    ...(isValueLeaf ? [kDisabled, kRequired] : []),
    {
      key: 'note',
      label: 'Developer note',
      kind: 'multiline',
      help: 'Behavior the mockup does not implement, for whoever builds the real thing.',
    },
  ];
}

/** Options are edited as text, one `value | label` per line, parsed when you leave the box. */
function optionsToText(options: SelectOption[] | undefined): string {
  return (options ?? [])
    .map((o) => (o.label && o.label !== o.value ? `${o.value} | ${o.label}` : o.value))
    .join('\n');
}

function textToOptions(text: string): SelectOption[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [value, ...rest] = line.split('|');
      const label = rest.join('|').trim();
      return label ? { value: value.trim(), label } : { value: value.trim() };
    });
}

/**
 * A textarea that keeps its own buffer and commits on blur, so half-typed lines survive.
 * Every inspector field is keyed by node id, so selecting a different node remounts this
 * and reseeds the buffer.
 */
const OptionsField: React.FunctionComponent<{
  node: ProtoNode;
  label: string;
  commit: (options: SelectOption[]) => void;
}> = ({ node, label, commit }) => {
  const [text, setText] = useState(() => optionsToText(node.options));
  return (
    <TextField
      label={label}
      size="small"
      fullWidth
      multiline
      minRows={3}
      value={text}
      helperText="One per line: value | label"
      onChange={(e) => setText(e.target.value)}
      onBlur={() => commit(textToOptions(text))}
    />
  );
};

/** A JSON object editor that only commits when what you typed actually parses. */
const JsonField: React.FunctionComponent<{
  value: unknown;
  label: string;
  help?: string;
  commit: (parsed: Record<string, unknown>) => void;
}> = ({ value, label, help, commit }) => {
  const [text, setText] = useState(() =>
    value === undefined ? '' : JSON.stringify(value, null, 2),
  );
  const [error, setError] = useState<string | undefined>();
  return (
    <TextField
      label={label}
      size="small"
      fullWidth
      multiline
      minRows={3}
      value={text}
      error={!!error}
      helperText={error ?? help}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        const trimmed = text.trim();
        if (!trimmed) {
          setError(undefined);
          commit({});
          return;
        }
        try {
          const parsed = JSON.parse(trimmed);
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            setError('Must be a JSON object.');
            return;
          }
          setError(undefined);
          commit(parsed as Record<string, unknown>);
        } catch {
          setError('Not valid JSON.');
        }
      }}
    />
  );
};

/**
 * Real fields for a custom control's props, driven by its customControlPropSpecs entry.
 * A control without one (or no control chosen yet) gets the JSON editor instead, so
 * hand-written controls still work before anyone writes specs for them.
 */
const CustomPropsFields: React.FunctionComponent<{
  node: ProtoNode;
  setProps: (props: Record<string, unknown>) => void;
}> = ({ node, setProps }) => {
  const specs = node.controlName ? customControlPropSpecs[node.controlName] : undefined;
  const current = (node.customProps ?? {}) as Record<string, unknown>;
  if (!specs) {
    return (
      <JsonField
        value={node.customProps}
        label="Control props (JSON)"
        help="This control has no prop specs in customControls.tsx yet, so edit its props as JSON."
        commit={setProps}
      />
    );
  }
  const setProp = (propKey: string, value: unknown) => {
    const next = { ...current };
    if (value === '' || value === undefined || value === false) delete next[propKey];
    else next[propKey] = value;
    setProps(next);
  };
  return (
    <>
      {specs.map((spec) => {
        const key = `${node.id}-${node.controlName}-${spec.key}`;
        const value = current[spec.key];
        if (spec.kind === 'checkbox') {
          return (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  size="small"
                  checked={!!value}
                  onChange={(e) => setProp(spec.key, e.target.checked)}
                />
              }
              label={<Typography variant="body2">{spec.label}</Typography>}
            />
          );
        }
        return (
          <TextField
            key={key}
            size="small"
            label={spec.label}
            multiline={spec.kind === 'multiline'}
            minRows={spec.kind === 'multiline' ? 2 : undefined}
            value={typeof value === 'string' ? value : ''}
            helperText={spec.help}
            onChange={(e) => setProp(spec.key, e.target.value)}
          />
        );
      })}
    </>
  );
};

/** Replace-from-clipboard plus what the picture is costing us in storage. */
const ImageControls: React.FunctionComponent<{
  node: ProtoNode;
  replaceFromClipboard: (nodeId: string) => void;
}> = ({ node, replaceFromClipboard }) => (
  <>
    <Button
      size="small"
      variant="outlined"
      onClick={() => replaceFromClipboard(node.id)}
      css={css`
        text-transform: none;
        align-self: flex-start;
      `}
    >
      Replace from clipboard
    </Button>
    <Typography
      variant="caption"
      css={css`
        color: #666;
      `}
    >
      {node.imageData
        ? `About ${approximateStoredKB(node.imageData)} KB stored`
        : 'No image yet. Paste onto the canvas, or use the button above.'}
    </Typography>
  </>
);

export const Inspector: React.FunctionComponent<{
  node: ProtoNode | undefined;
  isRoot: boolean;
  actions: ProtoActions;
  replaceImageFromClipboard: (nodeId: string) => void;
}> = ({ node, isRoot, actions, replaceImageFromClipboard }) => {
  if (!node) {
    return (
      <Typography
        variant="body2"
        css={css`
          padding: 16px;
          color: #666;
        `}
      >
        Nothing selected.
      </Typography>
    );
  }

  // The cast is contained here: FieldSpec.key is a real key of ProtoNode, but TypeScript
  // widens a computed key to a string index signature.
  const setField = (key: keyof ProtoNode, value: unknown) =>
    actions.updateProps(node.id, { [key]: value } as Partial<ProtoNode>);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        overflow-y: auto;
      `}
    >
      <Typography variant="subtitle2">{typeLabels[node.type]}</Typography>

      {specsFor(node).map((spec) => {
        const value = node[spec.key];
        const key = `${node.id}-${spec.key}`;
        switch (spec.kind) {
          case 'checkbox':
            return (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    size="small"
                    checked={!!value}
                    onChange={(e) => setField(spec.key, e.target.checked)}
                  />
                }
                label={<Typography variant="body2">{spec.label}</Typography>}
              />
            );
          case 'enum': {
            const choices = spec.choices ?? [];
            const current = (value as string) ?? '';
            const shown = choices.includes(current)
              ? current
              : ((spec.emptyChoiceLabel ? '' : choices[0]) ?? '');
            return (
              <TextField
                key={key}
                select
                size="small"
                label={spec.label}
                value={shown}
                helperText={spec.help}
                onChange={(e) => setField(spec.key, e.target.value)}
              >
                {spec.emptyChoiceLabel && (
                  <MenuItem value="">
                    <em>{spec.emptyChoiceLabel}</em>
                  </MenuItem>
                )}
                {choices.map((choice) => (
                  <MenuItem key={choice} value={choice}>
                    {choice}
                  </MenuItem>
                ))}
              </TextField>
            );
          }
          case 'options':
            return (
              <OptionsField
                key={key}
                node={node}
                label={spec.label}
                commit={(options) => setField('options', options)}
              />
            );
          case 'json':
            return (
              <JsonField
                key={key}
                value={value}
                label={spec.label}
                help={spec.help}
                commit={(parsed) => setField(spec.key, parsed)}
              />
            );
          case 'number':
            return (
              <TextField
                key={key}
                size="small"
                type="number"
                label={spec.label}
                value={value === undefined ? '' : String(value)}
                helperText={spec.help}
                onChange={(e) =>
                  setField(
                    spec.key,
                    e.target.value === '' ? undefined : Number(e.target.value),
                  )
                }
              />
            );
          default:
            return (
              <TextField
                key={key}
                size="small"
                label={spec.label}
                multiline={spec.kind === 'multiline'}
                minRows={spec.kind === 'multiline' ? 2 : undefined}
                value={value === undefined || value === null ? '' : String(value)}
                helperText={spec.help}
                onChange={(e) => setField(spec.key, e.target.value)}
              />
            );
        }
      })}

      {node.type === 'custom' && (
        <CustomPropsFields
          node={node}
          setProps={(props) => setField('customProps', props)}
        />
      )}

      {node.type === 'image' && (
        <ImageControls node={node} replaceFromClipboard={replaceImageFromClipboard} />
      )}

      <Divider />

      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        `}
      >
        <Button
          size="small"
          disabled={isRoot}
          onClick={() => actions.move(node.id, -1)}
          css={css`
            text-transform: none;
          `}
        >
          Up
        </Button>
        <Button
          size="small"
          disabled={isRoot}
          onClick={() => actions.move(node.id, 1)}
          css={css`
            text-transform: none;
          `}
        >
          Down
        </Button>
        <Button
          size="small"
          disabled={isRoot}
          onClick={() => actions.duplicate(node.id)}
          css={css`
            text-transform: none;
          `}
        >
          Duplicate
        </Button>
        <Button
          size="small"
          color="error"
          disabled={isRoot}
          onClick={() => actions.remove(node.id)}
          css={css`
            text-transform: none;
          `}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
