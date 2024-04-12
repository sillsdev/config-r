import { css } from '@emotion/react';
import { Tooltip } from '@mui/material';
import * as React from 'react';
import {
  ConfigrGroup,
  ConfigrToggleGroup,
  ConfigrMakeToggle,
} from '../../lib/ContentPane';

type CharacterAlternateDefinition = {
  name: string;
  cvNum: number;
  choices: string[];
  codepoint: string;
};
// It is my understanding that all SIL roman fonts have these:
const SILRomanCharacterAlternate: CharacterAlternateDefinition[] = [
  { name: 'B hook', cvNum: 13, codepoint: 'ɓ', choices: ['standard', 'lowercase-style'] },
  {
    name: 'Eng',
    cvNum: 43,
    codepoint: 'Ŋ',
    choices: [
      'Standard',
      'Lowercase style on baseline',
      'Uppercase style with descender',
      'Alt. lowercase style on baseline',
    ],
  },
];

export const SILCharacterAlternates: React.FunctionComponent<{ path: string }> = (
  props,
) => {
  return (
    // TODO: configr can't handle a subpage inside of a subpage <ConfigrSubPage label="Character Alternates" path={`${props.path}`}>
    // TODO: configr doesn't display groups properly in subpages {/* <configrgroup path={`${props.path}`} label={'SIL Font Character Alternates'}> */}

    <ConfigrGroup path={`${props.path}`} label={'SIL Font Character Alternates'}>
      {SILRomanCharacterAlternate.map((alternate) => {
        return (
          <CharacterAlternate
            key={alternate.cvNum}
            path={`${props.path}`}
            definition={alternate}
          />
        );
      })}
    </ConfigrGroup>
  );
};

export const CharacterAlternate: React.FunctionComponent<{
  path: string;
  definition: CharacterAlternateDefinition;
}> = (props) => {
  return (
    <ConfigrToggleGroup
      path={`${props.path}.cv${props.definition.cvNum}`}
      label={props.definition.name}
      height={'60px'}
      overrideValue={'1'} // silly but works for both examples
      overrideDescription="This is locked by Kyrgyzstan xmatter"
      // todo: this css injection does nothing
      css={css`
        .Mui-selected * {
          font-weight: bold;
        }
      `}
    >
      {props.definition.choices.map((choiceLabel, index) => {
        const content = (
          <CharacterChoice
            choiceValue={index.toString()}
            choiceLabel={choiceLabel}
            {...props}
          />
        );
        return ConfigrMakeToggle(index.toString(), content);
      })}
    </ConfigrToggleGroup>
  );
};

const CharacterChoice: React.FunctionComponent<{
  path: string;
  choiceValue: string;
  choiceLabel: string;
  definition: CharacterAlternateDefinition;
}> = (props) => {
  return (
    <Tooltip title={props.choiceLabel}>
      <span
        css={css`
          font-family: Andika;
          font-feature-settings: 'cv${props.definition.cvNum}' ${props.choiceValue};
          margin-right: 10px;
          color: black;
          font-size: 16px;
          height: 20px;
        `}
      >
        {props.definition.codepoint}
      </span>
    </Tooltip>
  );
};
