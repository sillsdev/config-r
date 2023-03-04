import { css } from '@emotion/react';
import * as React from 'react';
import { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Dialog } from '@mui/material';

export const ConfigrColorPicker: React.FunctionComponent<{
  value: string;
  onChange: (value: string) => void;
}> = (props) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>(props.value);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
    if (props.onChange) props.onChange(newColor.hex);
  };

  return (
    <div>
      <SwatchButton color={color} onClick={handleClick} />

      <Dialog open={displayColorPicker} onClose={handleClose}>
        <ChromePicker
          color={color}
          onChange={handleChange}
          css={css`
            padding: 10px;
          `}
        />
      </Dialog>
    </div>
  );
};

export const SwatchButton: React.FunctionComponent<{
  color: string;
  onClick: () => void;
}> = (props) => {
  return (
    <button
      onClick={props.onClick}
      css={css`
        border: solid 1px black;
        background-color: white;
        padding: 2px;
        cursor: pointer;
      `}
    >
      <div
        css={css`
          width: 72px;
          height: 19px;
          background-color: ${props.color};
        `}
      />
    </button>
  );
};
