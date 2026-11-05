/*************************
 *
 * NOTE: I was not able to get storybook working with the emotion css-prop under vite.
 * Gave it a couple hours, decided to wait until some parts leave alpha and in the
 * meantime, just run one of the stories at a time, from app. That is, compiled by
 * vite instead of storybook-builder-vite.
 */

import { css } from '@emotion/react';

import * as React from 'react';
import { ConfigrPane } from '../../lib/ConfigrPane';

import {
  ConfigrPage,
  ConfigrInput,
  ConfigrBoolean,
  ConfigrRadioGroup,
  ConfigrRadio,
  ConfigrChooserButton,
  ConfigrConditional,
  ConfigrGroup,
  ConfigrForEach,
  useConfigrValue,
} from '../../lib/ContentPane';
import { Button } from '@mui/material';

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
      `}
    >
      <ConfigrPane
        label="Pet Settings"
        initialValues={initialPetValues}
        showSearch={true}
        showJson={true}
        // setValueGetter={(fn) => (getCurrentValues = fn)}
        initiallySelectedTopLevelPageKey="dog"
      >
        <ConfigrPage label="Dog" pageKey="dog">
          <ConfigrGroup key={'dog'}>
            <ConfigrInput path="dog.name" label="Name" />
            <ConfigrInput path="dog.age" label="Age" type="number" />
            <ConfigrBoolean
              path="dog.friendly"
              label="Friendly"
              description="Does this dog like other dogs?"
            ></ConfigrBoolean>
            <ConfigrChooserButton
              path="dog.photos"
              label="Folder of dog photos"
              description="What does the dog look like?"
              buttonLabel="Choose..."
              chooseAction={(currentValue: string) => {
                return 'x' + (currentValue || '');
              }}
            ></ConfigrChooserButton>
          </ConfigrGroup>
        </ConfigrPage>
        <ConfigrPage label="Bird" pageKey="bird">
          <ConfigrGroup key="bird">
            <ConfigrInput
              path="bird.name"
              label="Name"
              getErrorMessage={(data) =>
                (data as unknown as IPetSettings).bird.name.indexOf('!') > -1
                  ? 'No punctuation allowed'
                  : undefined
              }
            />
            <ConfigrRadioGroup path="bird.kind" label="Kind">
              <ConfigrRadio label="Parakeet" value="parakeet" />
              <ConfigrRadio label="Parrot" value="parrot" />
            </ConfigrRadioGroup>
          </ConfigrGroup>
        </ConfigrPage>
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
      `}
    >
      <ConfigrPane
        label="lameta Settings"
        initialValues={initialLametaValues}
        showSearch={true}
      >
        <ConfigrPage label="Files" pageKey="files">
          <ConfigrGroup>
            <ConfigrBoolean
              path="files.useLargeFileFolder"
              label="Use Large File Folder"
              description="Avoid copying in large files that you already keep somewhere else (e.g. an external drive)."
            ></ConfigrBoolean>
            <ConfigrConditional
              enableWhen={(values: any) => values.files.useLargeFileFolder}
            >
              <ConfigrChooserButton
                path="files.largeFileFolder"
                label="Large File Folder Location"
                buttonLabel="Choose..."
                chooseAction={(currentValue: string) => {
                  return 'x' + (currentValue || '');
                }}
              ></ConfigrChooserButton>
            </ConfigrConditional>
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>
    </div>
  );
};

const initialLocalizedValues = {
  profile: { displayName: '', region: '' },
};

export const LocalizedStrings: React.FunctionComponent<{}> = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 320px;
      `}
    >
      <ConfigrPane
        label="Configuracion"
        initialValues={initialLocalizedValues}
        showSearch={true}
        initiallySelectedTopLevelPageKey="profile"
        localizations={{
          fieldRequiredMessage: 'Requiere un valor',
          invalidValueMessage: 'Valor no valido',
          searchLabel: 'Buscar',
          matchesLabel: (count) => `${count} coincidencias`,
        }}
      >
        <ConfigrPage label="Perfil" pageKey="profile">
          <ConfigrGroup>
            <ConfigrInput path="profile.displayName" label="Nombre" required={true} />
            <ConfigrInput
              path="profile.region"
              label="Region"
              required={true}
              validation={(value) => String(value ?? '').trim().length >= 3}
            />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>
    </div>
  );
};

// A heading action that clears a value, as Bloom's Remove button does for a language.
const RemoveSignLanguage: React.FunctionComponent = () => {
  const [language, setLanguage] = useConfigrValue<object | null>(
    'languages.signLanguage',
  );
  return (
    <Button size="small" disabled={!language} onClick={() => setLanguage(null)}>
      Remove
    </Button>
  );
};

export const GroupHeaderActionAndBold: React.FunctionComponent<{}> = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 400px;
      `}
    >
      <ConfigrPane
        label="Languages"
        initialValues={{
          languages: { signLanguage: { name: 'ASL' }, rightToLeft: false },
        }}
        showJson={true}
      >
        <ConfigrPage label="Languages" pageKey="languages">
          <ConfigrGroup label="Sign Language" headerAction={<RemoveSignLanguage />}>
            <ConfigrInput path="languages.signLanguage.name" label="Name" />
          </ConfigrGroup>
          <ConfigrGroup label="Writing">
            <ConfigrBoolean
              path="languages.rightToLeft"
              label="Right to left"
              description="If you are not **SURE**, then do not turn this on. If your language is written starting on the right and moving left, you will **KNOW**. *Most* languages are left to right."
            />
          </ConfigrGroup>
        </ConfigrPage>
      </ConfigrPane>
    </div>
  );
};

export default {
  title: 'Pets',
  component: () => <Pets />,
};
