import { css } from '@emotion/react';
import { Link, Slider, ThemeOptions, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { ConfigrPane } from '../../lib/ConfigrPane';

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
  ConfigrCustomStringInput,
  ConfigrCustomNumberInput,
  ConfigrCustomObjectInput,
} from '../../lib/ContentPane';
import { ConfigrColorPicker } from '../../lib/ConfigrColorPicker';
import { SILCharacterAlternates } from './SILCharacterAlternates';
import { useField } from 'formik';

const initialBloomCollectionValues = {
  pageNumberStyle: 'Decimal',
  languages: [
    {
      label: 'Local Language',
      id: { iso: 'de', name: 'German' },
      font: 'Andika New Basic',
      fontFeatures: { silCharacterAlternates: { cv13: '0', cv43: '1' } },
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
        avoidAsianScriptWordBreaking: true,
        tallerLines: false,
        fontSizeInTools: false,
      },
      fontFeatures: { silCharacterAlternates: { cv13: '1', cv43: '2' } },
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

export const BloomCollection: React.FunctionComponent = (props) => {
  //const [results, setResults] = useState('');
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <BloomCollectionInner
        onChange={(currentValues) => {
          // const pretty = JSON.stringify(currentValues, null, 4);
          // setResults(pretty);
        }}
      />
    </div>
  );
};

const BloomCollectionInner: React.FunctionComponent<{
  onChange?: (currentValues: any) => void; // just used to see the realtime value
}> = (props) => {
  const bloomThemeOverrides: ThemeOptions = {
    palette: {
      primary: {
        main: '#a108e8',
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
        showJson={true}
        css={css`
          background-color: #cfa7e7;
          padding: 20px;
          width: 700px;
        `}
        // {...props}
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
                      description={
                        'Something long about the default font. Fonts are good. They are actually "Typefaces" but we call them fonts.'
                      }
                      overrideValue="Arial"
                      overrideDescription="This is locked by Kyrgyzstan xmatter"
                    ></ConfigrSelect>
                  )}

                  {!language.isSignLanguage && (
                    <ConfigrSubPage label="Script Settings" path={`${prefix}.script`}>
                      <ConfigrBoolean
                        overrideValue={true}
                        overrideDescription="This is locked by Kyrgyzstan xmatter"
                        label="This is a right to left script, like Arabic"
                        path={`${prefix}.script.rtl`}
                      />
                      <ConfigrBoolean
                        label="Do not use special Asian script word breaking"
                        path={`${prefix}.script.avoidAsianScriptWordBreaking`}
                        overrideValue={false}
                        overrideDescription="This is locked by Kyrgyzstan xmatter"
                      />
                      <ConfigrBoolean
                        label="This script requires taller lines (locked)"
                        path={`${prefix}.script.tallerLines`}
                        locked={true}
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
                  {/* Currently cant' get a subpage inside of another subpage (script), so we have to have the path go to "fontFeatures" */}
                  <ConfigrSubPage label={'Font Features'} path={`${prefix}.fontFeatures`}>
                    <SILCharacterAlternates
                      path={`${prefix}.fontFeatures.silCharacterAlternates`}
                    />
                  </ConfigrSubPage>
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
              { label: '--', value: '' },
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
            <ConfigrRadioGroup
              path="enterprise-mode"
              label="An override locked one"
              overrideValue="subscribed"
              overrideDescription="This is locked by Kyrgyzstan xmatter"
            >
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
                'Projects that have [Bloom Enterprise subscriptions](https://sites.google.com/sil.org/bloom-program/bloom-enterprise) can arrange for one or more bookshelves on the [Bloom Library](https://bloomlibrary.org). All books uploaded from this collection will go into the selected bookshelf.'
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
              immediateEffect={true}
            />
              <ConfigrBoolean
              label="Show Experimental Book Sources (disabled)"
              path="feature.experimentalBookSources"
              immediateEffect={true}
              disabled={true}
            />
              <ConfigrBoolean
              label="Show Experimental Book Sources (locked)"
              path="feature.experimentalBookSources"
              immediateEffect={true}
              locked={true}
            />
            <ConfigrBoolean
              label="Team Collections"
              path="feature.teamCollections"
              description="Enabling this will show the settings for creating a Team Collection, which lets your team automatically synchronize your work with each other."
            />
            <ConfigrBoolean
              label="Spreadsheet Import/Export"
              path="feature.spreadsheet"
              disabled={true}
            />
          </ConfigrSubgroup>
        </ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};

export const BloomBook: React.FunctionComponent = (props) => {
  const [results, setResults] = useState('');
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <BloomBookInner
        onChange={(currentValues) => {
          const pretty = JSON.stringify(currentValues, null, 4);
          setResults(pretty);
        }}
      />
      <div
        css={css`
          white-space: pre;
          margin-left: 20px;
        `}
      >
        {results}
      </div>
    </div>
  );
};

// A very rough first draft based on the options I see in each publish tab
// This is way more than we want in V1 of the Book options but I thought it was an interesting
// experiment to see which ones are problems with our current repertoir.
const initialBloomBookValues = {
  appearance: {
    cover: {
      coverColor: '#ffcc00',
    },
    margins: {
      marginTop: 44,
      marginBottom: 44,
      marginOuter: 44,
      marginInner: 44,
    },
    spacing: {
      verticalBlocks: 10,
    },
  },
  pdfPrint: {
    cmyk: false,
    fullBleed: false,
  },
  bloomPub: {
    motion: false,
    languages: [{ code: 'fr', name: 'French', include: true, complete: false }],
    narrationLanguages: [{ code: 'fr', name: 'French', include: false, present: false }],
  },
  bloomLibrary: {
    summary: 'a book',
    // Somehow the appropriate control needs to know whether it should be enabled.
    // enabled: doesn't really belong here, as it's not data we want to persist.
    accessible: false,
    signLanguages: false,
    languages: [
      // complete, and the name, represent additional data that we need to make
      // the UI look right, but they are changeable properties of the other data
      // in the book, not part of saved settings. How should we handle that?
      // Likewise name and present below.
      { code: 'fr', name: 'French', include: true, complete: false },
    ],
    narrationLanguages: [{ code: 'fr', name: 'French', include: false, present: false }],
    music: false,
    // sign languguage separately? or oe of languages?
  },
  epub: {
    options: {
      mode: 'fixed',
      // Want a way to say this should be disabled if book has none
      // That isn't part of the saved options, so probably should be communicated to the
      // tool another way. How?
      imageDescriptionsOnPage: false,
    },
    metadata: {
      author: 'Joe',
      summary: 'a book', // should this be the same summary as in bloomLibrary?
      ageRange: '5-8',
      level: 3, // related to leveled reader level?
      subjects: ['crime'],
      accessabilityLevel: 'Level AA Conformance',
      accessibilityCertifiedBy: 'me',
      flashingHazard: undefined, // Todo: want this to mean "unknown" for tristate checkbox
      motionHazard: false,
      hasImageDescriptions: false, // related to whether imageDescriptionsOnPage is enabled?
      hasSignLanguage: false,
    },
  },
};

const propsForMmField = {
  units: 'mm',
};

// This doesn't yet have Configr elements for all the options above. I wanted to focus on things that might be a problem.
// One I don't know how to do at all with the current components is the list of checkboxes for which languages to include.
const BloomBookInner: React.FunctionComponent<{
  onChange?: (currentValues: any) => void; // just used to see the realtime value
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
        label="Book Settings"
        initialValues={initialBloomBookValues}
        themeOverrides={bloomThemeOverrides}
        showSearch={true}
        css={css`
          padding: 20px;
          width: 700px;
        `}
        {...props}
      >
        <ConfigrGroup label="Appearance" level={1}>
          <ConfigrSubgroup label="Cover" path="appearance.cover">
            <ConfigrCustomStringInput
              path={`appearance.cover.coverColor`}
              label="Cover Color"
              //disabled={true}
              overrideValue="#ff80ee"
              overrideDescription="This is locked by Kyrgyzstan xmatter"
              description={'this is custom'}
              control={ConfigrColorPicker}
            />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Margins" path="appearance.margins">
            <ConfigrInput
              label="Gap"
              path="appearance.imageTextGapMillimeters"
              units="mm"
            />

            <ConfigrInput
              path={`appearance.margins.marginTop`}
              label="Top"
              {...propsForMmField}
            />
            <ConfigrInput
              path={`appearance.margins.marginBottom`}
              label="Bottom"
              {...propsForMmField}
            />
            <ConfigrInput
              path={`appearance.margins.marginOuter`}
              label="Outer"
              {...propsForMmField}
            />
            <ConfigrInput
              path={`appearance.margins.marginInner`}
              label="Inner"
              {...propsForMmField}
            />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Spacing" path="appearance.cover">
            <ConfigrInput
              path={`appearance.spacing.verticalBlocks`}
              label="Between Vertical Blocks"
              {...propsForMmField}
            />
          </ConfigrSubgroup>
        </ConfigrGroup>
        <ConfigrGroup label="Bloom Library" level={1}>
          <ConfigrInput
            path={`bloomLibrary.summary`}
            label="Summary"
            // Wants a way to say to leave more space for a summary.
          />
        </ConfigrGroup>
        <ConfigrGroup label="ePUB" level={1}>
          <ConfigrSubgroup label="Options" path="epub.options">
            <ConfigrSelect
              path={'epub.options.mode'}
              label="ePUB mode"
              options={[
                {
                  label: 'Fixed - ePUB 3',
                  value: 'fixed',
                  description:
                    'Ask ePUB reader to show pages exactly like you see them in Bloom',
                },
                {
                  label: 'Flowable',
                  value: 'flowable',
                  description:
                    'Allow ePUB readers to lay out images and text however they like',
                },
              ]}
            />
            <ConfigrBoolean
              label="Image Descriptions on Page"
              description="Normally image descriptions are just audio, but this puts them in print as well."
              path="epub.options.imageDescriptionsOnPage"
            />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Metadata" path="epub.metadata">
            <ConfigrInput path={`epub.metadata.author`} label="Author" />
            <ConfigrBoolean
              label="Flashing Hazard"
              path="epub.options.flashingHazard"
              // Want a way that this can be undefined meaning unknown
              // May want to group these as "Hazards" but trying to avoid too many levels
            />
            <ConfigrBoolean
              label="Motion Simulation Hazard"
              path="epub.options.motionHazard"
            />
          </ConfigrSubgroup>
        </ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};

// V1 book settings
// - custom margins
//- cover color
// - Control over image compression
//- whether to show the page number
// - choose a “theme” (a css)
const initialV1BloomBookValues = {
  appearance: {
    cover: {
      coverColor: '#ffcc00',
    },
    margins: {
      marginTop: 44,
      marginBottom: 44,
      marginOuter: 44,
      marginInner: 44,
    },
    // Todo: this is used in compressing books for publication, so it belongs in a publish tab.
    // (If it proves a nuisance to collapse things to one tab, maybe this gives us an excuse to have a second one?)
    maxImageSize: {
      width: 600,
      height: 600,
    },
    other: {
      showPageNumber: true,
      theme: 'default',
    },
  },
};

export const BloomBookV1: React.FunctionComponent = (props) => {
  const [results, setResults] = useState('');
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <BloomBookInnerV1
        onChange={(currentValues) => {
          const pretty = JSON.stringify(currentValues, null, 4);
          setResults(pretty);
        }}
      />
      <div
        css={css`
          white-space: pre;
          margin-left: 20px;
        `}
      >
        {results}
      </div>
    </div>
  );
};

const BloomBookInnerV1: React.FunctionComponent<{
  onChange?: (currentValues: any) => void; // just used to see the realtime value
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
        label="Book Settings"
        initialValues={initialV1BloomBookValues}
        themeOverrides={bloomThemeOverrides}
        showSearch={false}
        css={css`
          padding: 20px;
          width: 700px;
        `}
        {...props}
      >
        <ConfigrGroup
          label=""
          level={1}
          // This should have a label, "Appearance", when there is more than one ConfigrGroup.
          // While there is not, it just takes up space and confuses things.
        >
          <ConfigrSubgroup label="Cover" path="appearance.cover">
            <ConfigrCustomStringInput
              path={`appearance.cover.coverColor`}
              label="Cover Color"
              control={ConfigrColorPicker}
            />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Margins" path="appearance.margins">
            <ConfigrInput
              path={`appearance.margins.marginTop`}
              label="Top"
              {...propsForMmField}
            />
            <ConfigrInput
              path={`appearance.margins.marginBottom`}
              label="Bottom"
              {...propsForMmField}
            />
            <ConfigrInput
              path={`appearance.margins.marginOuter`}
              label="Outer"
              {...propsForMmField}
            />
            <ConfigrInput
              path={`appearance.margins.marginInner`}
              label="Inner"
              {...propsForMmField}
            />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Max Image Size" path="appearance.maxImageSize">
            <BloomResolutionSlider
              path={`appearance.maxImageSize`}
              label="Max Resolution"
              // Wants validation to be a positive number, possibly with an upper limit...2000? 5000?
            />
          </ConfigrSubgroup>
          <ConfigrSubgroup label="Other" path="appearance.other">
            <ConfigrBoolean
              label="Show Page Numbers"
              path="appearance.other.showPageNumber"
              disabled={true}
            />
            <ConfigrInput
              path={`appearance.other.theme`}
              label="Theme"
              // Review: is this meant to be a place where the user can enter an arbitrary CSS file name?
              // Or are we thinking of providing a fixed set of built-in themes he can choose from, so
              // this should be a select?
            />
          </ConfigrSubgroup>
        </ConfigrGroup>
      </ConfigrPane>
    </div>
  );
};

type Resolution = {
  maxWidth: number;
  maxHeight: number;
};

const BloomResolutionSlider: React.FunctionComponent<
  React.PropsWithChildren<{
    path: string;
    label: string;
    getErrorMessage?: (data: any) => string | undefined;
  }>
> = (props) => {
  return (
    <ConfigrCustomObjectInput<Resolution>
      control={BloomResolutionSliderInner}
      {...props}
    ></ConfigrCustomObjectInput>
  );
};

const BloomResolutionSliderInner: React.FunctionComponent<{
  value: Resolution;
  onChange: (value: Resolution) => void;
}> = (props) => {
  const sizes = [
    { l: 'Small', w: 600, h: 600 },
    { l: 'HD', w: 1280, h: 720 },
    { l: 'Full HD', w: 1920, h: 1080 },
    { l: '4k', w: 3840, h: 2160 },
  ];
  let currentIndex = sizes.findIndex((x) => x.w === props.value.maxWidth);
  if (currentIndex === -1) {
    currentIndex = 0;
  }
  const current = sizes[currentIndex];

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 200px; // todo: what should this be?
      `}
    >
      <Typography
        css={css`
          text-align: right;
        `}
        variant="h3"
      >{`${current.l}`}</Typography>
      <Slider
        track={false}
        max={sizes.length - 1}
        min={0}
        step={1}
        value={currentIndex}
        valueLabelFormat={() => {
          return `${current.w}x${current.h}`;
        }}
        onChange={(e, value) => {
          props.onChange({
            maxWidth: sizes[value as number].w,
            maxHeight: sizes[value as number].h,
          });
        }}
        valueLabelDisplay="auto"
      ></Slider>
    </div>
  );
};
