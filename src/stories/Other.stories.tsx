/*************************
 *
 * NOTE: I was not able to get storybook working with the emotion css-prop under vite.
 * Gave it a couple hours, decided to wait until some parts leave alpha and in the
 * meantime, just run one of the stories at a time, from app. That is, compiled by
 * vite instead of storybook-builder-vite.
 */

import { css } from '@emotion/react';

import React from 'react';

import {
  ConfigrPane,
  ConfigrGroup,
  ConfigrInput,
  ConfigrBoolean,
  ConfigrRadioGroup,
  ConfigrRadio,
  ConfigrChooserButton,
  ConfigrConditional,
  ConfigrSubgroup,
  ConfigrForEach,
  ConfigurSubPage,
} from '../ConfigrPane';

interface IPetSettings {
  dog: { name: string; friendly: boolean };
  bird: { name: string; kind: string; nameError?: string };
}
const initialPetValues = {
  dog: { name: 'Sanuk', friendly: true },
  bird: { name: 'Poly!', kind: 'parrot' },
};

export const Pets: React.FunctionComponent<{}> = (props) => {
  let getCurrentValues: () => object;

  return (
    <div
      id="foo"
      css={css`
        display: flex;
        flex-direction: column;
        height: 300px;
      `}>
      <ConfigrPane
        label="Pet Settings"
        initialValues={initialPetValues}
        showSearch={true}
        setValueGetter={(fn) => (getCurrentValues = fn)}
        showAllGroups={true}>
        <ConfigrGroup label="Dog">
          <ConfigrInput name="dog.name" label="Name" />
          <ConfigrBoolean
            name="dog.friendly"
            label="Friendly"
            labelSecondary="Does this dog like other dogs?"></ConfigrBoolean>
          <ConfigrChooserButton
            name="dog.photos"
            label="Folder of dog photos"
            labelSecondary="What does the dog look like?"
            buttonLabel="Choose..."
            chooseAction={(currentValue: string) => {
              return 'x' + (currentValue || '');
            }}></ConfigrChooserButton>
        </ConfigrGroup>
        <ConfigrGroup label="Bird">
          <ConfigrInput
            name="bird.name"
            label="Name"
            getErrorMessage={(d: IPetSettings) =>
              d.bird.name.indexOf('!') > -1 ? 'No punctuation allowed' : undefined
            }
          />
          <ConfigrRadioGroup name="bird.kind" label="Kind">
            <ConfigrRadio label="Parakeet" value="parakeet" />
            <ConfigrRadio label="Parrot" value="parrot" />
          </ConfigrRadioGroup>
        </ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};

const initialLametaValues = {
  files: { useLargeFileFolder: false },
};
export const Lameta: React.FunctionComponent<{}> = (props) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 300px;
      `}>
      <ConfigrPane
        label="lameta Settings"
        initialValues={initialLametaValues}
        showSearch={true}>
        <ConfigrGroup label="Files">
          <ConfigrBoolean
            name="files.useLargeFileFolder"
            label="Use Large File Folder"
            labelSecondary="Avoid copying in large files that you already keep somewhere else (e.g. an external drive)."></ConfigrBoolean>
          <ConfigrConditional
            enableWhen={(values: any) => values.files.useLargeFileFolder}>
            <ConfigrChooserButton
              name="files.largeFileFolder"
              label="Large File Folder Location"
              buttonLabel="Choose..."
              chooseAction={(currentValue: string) => {
                return 'x' + (currentValue || '');
              }}></ConfigrChooserButton>
          </ConfigrConditional>
        </ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};

export default {
  title: 'Pets',
  component: () => <Pets />,
};
