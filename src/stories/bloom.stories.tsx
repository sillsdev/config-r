import { css } from '@emotion/react';
import { Link } from '@mui/material';
import React, { useState } from 'react';
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
} from '../../lib/ContentPane';
import { SILCharacterAlternates } from './SILCharacterAlternates';

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
        avoidAsianScriptWordBreaking: false,
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

export const BloomCollection:  React.FunctionComponent = (props)  =>{
  const [results, setResults] = useState("");
  return  <div css={css`display:flex`}>
    <BloomCollectionInner setValueOnRender={(currentValues)=> {
      const pretty = JSON.stringify(currentValues, null, 4);
      setResults(pretty);
    }}/>
    <div css={css`white-space:pre; margin-left: 20px;`}>{results}</div>
  </div>;
}

const BloomCollectionInner: React.FunctionComponent<{
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


export const BloomBook:  React.FunctionComponent = (props)  =>{
  const [results, setResults] = useState("");
  return  <div css={css`display:flex`}>
    <BloomBookInner setValueOnRender={(currentValues)=> {
      const pretty = JSON.stringify(currentValues, null, 4);
      setResults(pretty);
    }}/>
    <div css={css`white-space:pre; margin-left: 20px;`}>{results}</div>
  </div>;
}

// A very rough first draft based on the options I see in each publish tab
// This is way more than we want in V1 of the Book options but I thought it was an interesting
// experiment to see which ones are problems with our current repertoir.
const initialBloomBookValues = {
  appearance: {
    cover: {
      coverColor: "#ffcc00",
    },
    margins: {
      marginTop: "44mm",
      marginBottom: "44mm",
      marginOuter: "44mm",
      marginInner: "44mm",
    },
    spacing: {
      verticalBlocks: "10mm"
    }
  },
  pdfPrint: {
    cmyk: false,
    fullBleed: false

  }, bloomPub: {
    motion: false,
    languages: [
      {code: "fr", name: "French", include: true, complete: false}
      ],
    narrationLanguages: [
      {code: "fr", name: "French", include: false, present: false}
      ]
  },
  bloomLibrary: {
    summary: "a book",
    // Somehow the appropriate control needs to know whether it should be enabled.
    // enabled: doesn't really belong here, as it's not data we want to persist.
    accessible: false,
    signLanguages: false,
    languages: [
      // complete, and the name, represent additional data that we need to make
      // the UI look right, but they are changeable properties of the other data
      // in the book, not part of saved settings. How should we handle that?
      // Likewise name and present below.
      {code: "fr", name: "French", include: true, complete: false}
      ],
    narrationLanguages: [
      {code: "fr", name: "French", include: false, present: false}
      ],
    music: false
    // sign languguage separately? or oe of languages?
  },
  epub: {
    options: {
      mode: "fixed",
      // Want a way to say this should be disabled if book has none
      // That isn't part of the saved options, so probably should be communicated to the
      // tool another way. How?
      imageDescriptionsOnPage: false,
    },
    metadata: {
      author: "Joe",
      summary: "a book", // should this be the same summary as in bloomLibrary?
      ageRange: "5-8",
      level: 3, // related to leveled reader level?
      subjects: ["crime"],
      accessabilityLevel: "Level AA Conformance",
      accessibilityCertifiedBy: "me",
      flashingHazard: undefined, // Todo: want this to mean "unknown" for tristate checkbox
      motionHazard: false,
      hasImageDescriptions: false, // related to whether imageDescriptionsOnPage is enabled?
      hasSignLanguage: false
    }
  }
};

// This doesn't yet have Configr elements for all the options above. I wanted to focus on things that might be a problem.
// One I don't know how to do at all with the current components is the list of checkboxes for which languages to include.
const BloomBookInner: React.FunctionComponent<{
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
    <div css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}>
      <ConfigrPane
        label="Book Settings"
        initialValues={initialBloomBookValues}
        themeOverrides={bloomThemeOverrides}
        showSearch={true}
        {...props}
      >
        <ConfigrGroup label="Appearance" level={1}>
          <ConfigrSubgroup label= "Cover" path='appearance.cover'>
            <ConfigrInput path={`appearance.cover.coverColor`} label="Cover Color" />
          </ConfigrSubgroup>
          <ConfigrSubgroup label= "Margins" path='appearance.margins'>
            <ConfigrInput path={`appearance.margins.marginTop`}
              // wants a way to say it can be mm, or in, or pt, or...
              label="Top" />
            <ConfigrInput path={`appearance.margins.marginBottom`} label="Bottom" />
            <ConfigrInput path={`appearance.margins.marginOuter`} label="Outer" />
            <ConfigrInput path={`appearance.margins.marginInner`} label="Inner" />
          </ConfigrSubgroup>
          <ConfigrSubgroup label= "Spacing" path='appearance.cover'>
            <ConfigrInput path={`appearance.spacing.verticalBlocks`} label="Between Vertical Blocks" />
          </ConfigrSubgroup>
          
        </ConfigrGroup>
        <ConfigrGroup label="Bloom Library" level={1}>
          <ConfigrInput path={`bloomLibrary.summary`} label="Summary"
          // Wants a way to say to leave more space for a summary.
           />
        </ConfigrGroup>
        <ConfigrGroup label="ePUB" level={1}>
          <ConfigrSubgroup label= "Options" path='epub.options'>
            <ConfigrSelect
              path={'epub.options.mode'}
              label="ePUB mode"
              options={[
                { label: 'Fixed - ePUB 3', value: 'fixed', description:"Ask ePUB reader to show pages exactly like you see them in Bloom" },
                { label: 'Flowable', value: 'flowable',  description:"Allow ePUB readers to lay out images and text however they like"},
              ]}
            />
            <ConfigrBoolean label="Image Descriptions on Page" path="epub.options.imageDescriptionsOnPage"/>
          </ConfigrSubgroup>
          <ConfigrSubgroup label= "Metadata" path='epub.metadata'>
            <ConfigrInput path={`epub.metadata.author`} label="Author" />
            <ConfigrBoolean label="Flashing Hazard" path="epub.options.flashingHazard"
            // Want a way that this can be undefined meaning unknown
            // May want to group these as "Hazards" but trying to avoid too many levels
            />
            <ConfigrBoolean label="Motion Simulation Hazard" path="epub.options.motionHazard"/>
          </ConfigrSubgroup>
          
        </ConfigrGroup>
      </ConfigrPane>
    </div>);
  }

  // V1 book settings
  // - custom margins
  //- cover color
// - Control over image compression
//- whether to show the page number
// - choose a “theme” (a css)
const initialV1BloomBookValues = {
  appearance: {
    cover: {
      coverColor: "#ffcc00",
    },
    margins: {
      marginTop: "44mm",
      marginBottom: "44mm",
      marginOuter: "44mm",
      marginInner: "44mm",
    },
    // Todo: this is used in compressing books for publication, so it belongs in a publish tab.
    // (If it proves a nuisance to collapse things to one tab, maybe this gives us an excuse to have a second one?)
    maxImageSize: {
      width: 600,
      height: 600
    },
    other: {
      showPageNumber: true,
      theme: "default"
    }
  }
}

export const BloomBookV1:  React.FunctionComponent = (props)  =>{
  const [results, setResults] = useState("");
  return  <div css={css`display:flex`}>
    <BloomBookInnerV1 setValueOnRender={(currentValues)=> {
      const pretty = JSON.stringify(currentValues, null, 4);
      setResults(pretty);
    }}/>
    <div css={css`white-space:pre; margin-left: 20px;`}>{results}</div>
  </div>;
}

const BloomBookInnerV1: React.FunctionComponent<{
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
    <div css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}>
      <ConfigrPane
        label="Book Settings"
        initialValues={initialV1BloomBookValues}
        themeOverrides={bloomThemeOverrides}
        showSearch={false}
        {...props}
      >
        <ConfigrGroup label="Appearance" level={1}>
          <ConfigrSubgroup label= "Cover" path='appearance.cover'>
            <ConfigrInput path={`appearance.cover.coverColor`} label="Cover Color" />
          </ConfigrSubgroup>
          <ConfigrSubgroup label= "Margins" path='appearance.margins'>
            <ConfigrInput path={`appearance.margins.marginTop`}
              // wants a way to say it can be mm, or in, or pt, or...
              label="Top" />
            <ConfigrInput path={`appearance.margins.marginBottom`} label="Bottom" />
            <ConfigrInput path={`appearance.margins.marginOuter`} label="Outer" />
            <ConfigrInput path={`appearance.margins.marginInner`} label="Inner" />
          </ConfigrSubgroup>
          <ConfigrSubgroup label= "Max Image Size" path='appearance.maxImageSize'>
            <ConfigrInput path={`appearance.maxImageSize.width`} label="Width" 
            // Wants validation to be a positive number, possibly with an upper limit...2000? 5000?
            />
            <ConfigrInput path={`appearance.maxImageSize.height`} label="Height" />
          </ConfigrSubgroup>
          <ConfigrSubgroup label= "Other" path='appearance.other'>
            <ConfigrBoolean label="Show Page Numbers" path="appearance.other.showPageNumber"/>
            <ConfigrInput path={`appearance.other.theme`} label="Theme" 
            // Review: is this meant to be a place where the user can enter an arbitrary CSS file name?
            // Or are we thinking of providing a fixed set of built-in themes he can choose from, so
            // this should be a select?
            />
          </ConfigrSubgroup>
          
        </ConfigrGroup>
     
      </ConfigrPane>
    </div>);
  }