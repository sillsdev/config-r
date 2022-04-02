import './App.css';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import { BloomCollection } from './stories/bloom.stories';
import { Lameta, Pets } from './stories/Other.stories';
import ReactJson from 'react-json-view';

function App() {
  const [currentValue, setCurrentValue] = useState({});
  // Having an app here is a holdover from when I couldn't get emotion css props to work with storybook.
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
