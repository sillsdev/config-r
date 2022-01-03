/*************************
 *
 * NOTE: I was not able to get storybook working with the emotion css-prop under vite.
 * Gave it a couple hours, decided to wait until some parts leave alpha and in the
 * meantime, just run one of the stories at a time, from app. That is, compiled by
 * vite instead of storybook-builder-vite.
 */

import { css } from '@emotion/react';
import { Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
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
  ConfigrSelect,
  defaultConfigrTheme,
} from '../ConfigrPane';

const initialBloomCollectionValues = {
  pageNumberStyle: 'Decimal',
  languages: [
    { id: { iso: 'de', name: 'German' }, font: 'Andika New Basic' },
    {
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
  ],
};
export default {
  title: 'BloomCollection',
  component: () => <BloomCollection />,
};

export const SearchTest: React.FunctionComponent<{}> = (props) => {
  return (
    <ConfigrPane
      label="Bloom Collection Settings"
      initialValues={{ colors: [{ color: 'red' }] }}
      showSearch={true}>
      {/* <ConfigrGroup label="Shapes" level={1}>
        <ConfigrSubgroup path="blah" label="Rectangles">
          <ConfigrBoolean path="foo" label="Square" />
        </ConfigrSubgroup>
      </ConfigrGroup> */}
      <ConfigrGroup label="Colors With Array " level={1}>
        <ConfigrForEach
          path="colors"
          searchTerms="color foo"
          render={(prefix: string, index: number) => (
            <ConfigrSubgroup path="color" label="Some Color">
              <ConfigrInput path="color" label="foo" />
            </ConfigrSubgroup>
          )}></ConfigrForEach>
      </ConfigrGroup>
    </ConfigrPane>
  );
};

export const BloomCollection: React.FunctionComponent<{}> = (props) => {
  // Enhance: it would of course be so much better for the
  // Configr Pane to have this logic instead of the client,
  // but I haven't figured out a way
  // for the outer theme to override the inner (Configr) component yet.
  // const bloomTheme = createTheme(
  //   //deepmerge(defaultConfigrTheme,
  //   {
  //     palette: {
  //       primary: {
  //         main: '#1D94A4',
  //       },
  //     },
  //   },
  //   //),
  // );
  const bloomThemeOverrides = {
    palette: {
      primary: {
        main: '#1D94A4',
      },
    },
  };
  const bloomTheme = createTheme(bloomThemeOverrides);
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
        themeOverrides={bloomThemeOverrides}
        showSearch={true}>
        <ConfigrGroup label="Languages" level={1}>
          <ConfigrForEach
            path="languages"
            searchTerms="font script right left word breaking Asian name iso"
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

                <ConfigrSelect
                  path={`${prefix}.font`}
                  label="Default Font"
                  options={[
                    { label: 'Arial', value: 'Arial' },
                    { label: 'Andika New Basic', value: 'Andika New Basic' },
                  ]}></ConfigrSelect>

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
        <ConfigrGroup label="Book Defaults">
          <ConfigrSelect
            path={'pageNumberStyle'}
            label="Page Numbering Style"
            options={[
              { label: 'Decimal', value: 'Decimal' },
              { label: 'Devanagari', value: 'Devanagari' },
            ]}></ConfigrSelect>
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
            ]}></ConfigrSelect>
        </ConfigrGroup>
        <ConfigrGroup
          label="Enterprise"
          description={
            <span>
              Bloom Enterprise adds features and services that are important for
              publishers, governments, and international organizations. This paid
              subscription meets their unique needs while supporting the development and
              user support of Bloom for the community at large.&nbsp;
              <Link href="google.com">Learn More</Link>
            </span>
          }>
          <ConfigrRadioGroup path="enterprise-mode" label="Status">
            <ConfigrRadio label="Subscribed" value="subscribed" />
            <ConfigrRadio label="Funded by the local community only" value="local" />
            <ConfigrRadio label="None" value="none" />
          </ConfigrRadioGroup>
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
