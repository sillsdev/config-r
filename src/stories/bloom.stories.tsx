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
  ConfigrSubPage as ConfigrSubPage,
} from '../ConfigrPane';

const initialBloomCollectionValues = {
  languages: [
    { iso: 'de', name: 'German' },
    {
      iso: 'ar',
      name: 'Arabic',
      script: {
        rtl: true,
        avoidAsianScriptWordBreaking: false,
        tallerLines: false,
        fontSizeInTools: false,
      },
    },
  ],
};
export default {
  title: 'BloomCollection',
  component: () => <BloomCollection />,
};

export const BloomCollection: React.FunctionComponent<{}> = (props) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 300px;
      `}>
      <ConfigrPane
        label="Bloom Collection Settings"
        initialValues={initialBloomCollectionValues}
        showSearch={true}>
        <ConfigrGroup label="Languages" hasSubgroups>
          <ConfigrForEach
            name="languages"
            render={(prefix: string, index: number) => (
              <ConfigrSubgroup
                name={`${prefix}`}
                label={`Language ${index}`}
                key={`${index}`}>
                <ConfigrInput name={`${prefix}.name`} label="Name" />
                <ConfigrInput name={`${prefix}.iso`} label="ISO" />
                <ConfigrSubPage label="Script Settings" name={`${prefix}.script`}>
                  <ConfigrBoolean
                    label="This is a right to left script, like Arabic"
                    name={`${prefix}.script.rtl`}
                  />
                  <ConfigrBoolean
                    label="Do not use special Asian script word breaking"
                    name={`${prefix}.script.avoidAsianScriptWordBreaking`}
                  />
                </ConfigrSubPage>
              </ConfigrSubgroup>
            )}></ConfigrForEach>
        </ConfigrGroup>
        <ConfigrGroup label="Book Defaults"></ConfigrGroup>
        <ConfigrGroup label="Collection"></ConfigrGroup>
        <ConfigrGroup label="Enterprise"></ConfigrGroup>
        <ConfigrGroup label="Advanced"></ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};
