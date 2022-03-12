/*************************
 *
 * NOTE: I was not able to get storybook working with the emotion css-prop under vite.
 * Gave it a couple hours, decided to wait until some parts leave alpha and in the
 * meantime, just run one of the stories at a time, from app. That is, compiled by
 * vite instead of storybook-builder-vite.
 */

import { css } from '@emotion/react';
import { Link } from '@mui/material';
import React from 'react';
import { ConfigrPane } from '../lib/ConfigrPane';

import {
  ConfigrGroup,
  ConfigrInput,
  ConfigrBoolean,
  ConfigrRadioGroup,
  ConfigrRadio,
  ConfigrSubgroup,
  ConfigrForEach,
  ConfigrSubPage as ConfigrSubPage,
  ConfigrSelect,
} from '../lib/ContentPane';

const initialBloomCollectionValues = {
  pageNumberStyle: 'Decimal',
  languages: [
    {
      label: 'Local Language',
      id: { iso: 'de', name: 'German' },
      font: 'Andika New Basic',
    },
    {
      label: 'Language 2 (e.g. National Language)',
      id: {
        iso: 'ar',
        name: 'Arabic',
      },
      font: 'Arial',
      script: {
        rtl: true,
        avoidAsianScriptWordBreaking: false,
        tallerLines: false,
        fontSizeInTools: false,
      },
    },
    {
      label: 'Language 3 (e.g. Regional Language) (Optional)',
      id: { iso: '--', name: '--' },
    },
    {
      label: 'Sign Language (Optional)',
      id: { iso: '--', name: '--' },
      isSignLanguage: true,
    },
  ],
};
export default {
  title: 'BloomCollection',
  component: () => <BloomCollection />,
};

export const BloomCollection: React.FunctionComponent<{
  setValueOnRender?: (currentValues: any) => void; // just used to see the realtime value
}> = (props) => {
  const bloomThemeOverrides = {
    palette: {
      primary: {
        main: '#1D94A4',
      },
    },
  };
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <ConfigrPane
        label="Bloom Collection Settings"
        initialValues={initialBloomCollectionValues}
        themeOverrides={bloomThemeOverrides}
        showSearch={true}
        {...props}
      >
        <ConfigrGroup label="Languages" level={1}>
          <ConfigrForEach
            path="languages"
            searchTerms="font script right left word breaking Asian name iso"
            render={(prefix: string, index: number) => {
              const language = initialBloomCollectionValues.languages[index];
              return (
                <ConfigrSubgroup
                  path={`${prefix}`}
                  label={language.label}
                  key={`${index}`}
                >
                  <ConfigrSubPage
                    label={language.id.name}
                    path={`${prefix}.id`}
                    labelCss={css`
                      font-weight: bold !important;
                    `}
                  >
                    <ConfigrInput path={`${prefix}.id.iso`} label="ISO" />
                    <ConfigrInput path={`${prefix}.id.name`} label="Name" />
                  </ConfigrSubPage>

                  {!language.isSignLanguage && (
                    <ConfigrSelect
                      path={`${prefix}.font`}
                      label="Default Font"
                      options={[
                        { label: 'Arial', value: 'Arial' },
                        { label: 'Andika New Basic', value: 'Andika New Basic' },
                      ]}
                    ></ConfigrSelect>
                  )}
                  {!language.isSignLanguage && (
                    <ConfigrSubPage label="Script Settings" path={`${prefix}.script`}>
                      <ConfigrBoolean
                        label="This is a right to left script, like Arabic"
                        path={`${prefix}.script.rtl`}
                      />
                      <ConfigrBoolean
                        label="Do not use special Asian script word breaking"
                        path={`${prefix}.script.avoidAsianScriptWordBreaking`}
                      />
                      <ConfigrBoolean
                        label="This script requires taller lines"
                        path={`${prefix}.script.tallerLines`}
                      />

                      <ConfigrSelect
                        enableWhen={`${prefix}.script.tallerLines`}
                        indented={true}
                        path={`${prefix}.script.tallerLines_defaultLineSpacing`}
                        label="Line Spacing"
                        options={[
                          { label: 'Default line spacing', value: '0' }, // todo
                          1.0,
                          1.1,
                          1.2,
                          1.3,
                          1.4,
                          1.5,
                          1.6,
                          1.7,
                          1.8,
                          1.9,
                          2.0,
                          2.5,
                          3.0,
                        ]}
                      ></ConfigrSelect>

                      <ConfigrSelect
                        path={`${prefix}.script.fontSizeInTools`}
                        label="Font size when displayed in tools"
                        options={[
                          { label: 'Default size', value: '0' }, // todo
                          9,
                          10,
                          11,
                          12,
                          14,
                          16,
                          18,
                          20,
                          22,
                          24,
                          26,
                        ]}
                      ></ConfigrSelect>
                    </ConfigrSubPage>
                  )}
                </ConfigrSubgroup>
              );
            }}
          ></ConfigrForEach>
        </ConfigrGroup>
        <ConfigrGroup label="Book Defaults">
          <ConfigrSelect
            path={'pageNumberStyle'}
            label="Page Numbering Style"
            options={[
              { label: 'Decimal', value: 'Decimal' },
              { label: 'Devanagari', value: 'Devanagari' },
            ]}
          ></ConfigrSelect>
          <ConfigrSelect
            path={'xmatterPck'}
            label="Front/Back Matter Pack"
            options={[
              { label: 'Paper Saver', value: 'Paper Saver' },
              { label: 'Super Paper Saver', value: 'Super Paper Saver' },
              {
                label: 'Traditional',
                value: 'Traditional',
                description: 'Credits on the back of the title page.',
              },
            ]}
          ></ConfigrSelect>
        </ConfigrGroup>
        <ConfigrGroup
          label="Enterprise"
          level={1}
          description={
            <span>
              Bloom Enterprise adds features and services that are important for
              publishers, governments, and international organizations. This paid
              subscription meets their unique needs while supporting the development and
              user support of Bloom for the community at large.&nbsp;
              <Link href="google.com">Learn More</Link>
            </span>
          }
        >
          <ConfigrSubgroup label="" path="">
            <ConfigrRadioGroup path="enterprise-mode" label="Status">
              <ConfigrRadio label="Subscribed" value="subscribed" />
              <ConfigrRadio label="Funded by the local community only" value="local" />
              <ConfigrRadio label="None" value="none" />
            </ConfigrRadioGroup>
          </ConfigrSubgroup>

          <ConfigrSubgroup label="" path="">
            <ConfigrSelect
              label="BloomLibrary.org Bookshelf"
              path={'bookshelf'}
              description={
                'Projects that have Bloom Enterprise subscriptions can arrange for one or more bookshelves on the Bloom Library. All books uploaded from this collection will go into the selected bookshelf.'
              }
              options={[{ label: 'TODO', value: 'TODO' }]}
            ></ConfigrSelect>
          </ConfigrSubgroup>
        </ConfigrGroup>
        <ConfigrGroup label="Location">
          <ConfigrInput path={`country`} label="Country" />
          <ConfigrInput path={`province`} label="Province" />
          <ConfigrInput path={`district`} label="District" />
        </ConfigrGroup>

        <ConfigrGroup label="Advanced" level={1}>
          <ConfigrSubgroup label="" path="">
            <ConfigrInput path="collectionName" label="Bloom Collection Name" />{' '}
            <ConfigrBoolean label="Automatically Update Bloom" path="autoUpdate" />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Experimental Features" path="feature">
            <ConfigrBoolean
              label="Show Experimental Book Sources"
              path="feature.experimentalBookSources"
            />
            <ConfigrBoolean
              label="Team Collections"
              path="feature.teamCollections"
              description="Enabling this will show the settings for creating a Team Collection, which lets your team automatically synchronize your work with each other."
            />
            <ConfigrBoolean
              label="Spreadsheet Import/Export"
              path="feature.spreadsheet"
            />
          </ConfigrSubgroup>
        </ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};
