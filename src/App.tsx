import './App.css';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import logo from './logo.svg';
import { BloomCollection } from './stories/bloom.stories';
import { Lameta, Pets } from './stories/Other.stories';
import ReactJson from 'react-json-view';

function App() {
  const [count, setCount] = useState(0);
  const [currentValue, setCurrentValue] = useState({});
  // Currently I can't get emotion's css prop to work when run by storybook,
  // so I'm running stories from here.
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <BloomCollection setValueOnRender={setCurrentValue} />
      {/* <Lameta></Lameta> */}
      {/* <Pets></Pets> */}
      <div
        css={css`
          padding: 20px;
        `}
      >
        <ReactJson src={currentValue} />
      </div>
    </div>
  );
}

export default App;
