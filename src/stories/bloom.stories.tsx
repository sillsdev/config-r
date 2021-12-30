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
    { id: { iso: 'de', name: 'German' } },
    {
      id: {
        iso: 'ar',
        name: 'Arabic',
      },
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
            path="languages"
            render={(prefix: string, index: number) => (
              <ConfigrSubgroup
                path={`${prefix}`}
                label={`Language ${index}`}
                key={`${index}`}>
                <ConfigrSubPage
                  label={initialBloomCollectionValues.languages[index].id.name}
                  path={`${prefix}.id`}
                  labelCss={css`
                    font-weight: bold !important;
                  `}>
                  <ConfigrInput path={`${prefix}.id.iso`} label="ISO" />
                  <ConfigrInput path={`${prefix}.id.name`} label="Name" />
                </ConfigrSubPage>

                <ConfigrInput path={`${prefix}.font-family`} label="Default Font" />

                <ConfigrSubPage label="Script Settings" path={`${prefix}.script`}>
                  <ConfigrBoolean
                    label="This is a right to left script, like Arabic"
                    path={`${prefix}.script.rtl`}
                  />
                  <ConfigrBoolean
                    label="Do not use special Asian script word breaking"
                    path={`${prefix}.script.avoidAsianScriptWordBreaking`}
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
