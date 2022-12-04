import './App.css';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import { BloomCollection } from './stories/bloom.stories';
import { Lameta, Pets } from './stories/Other.stories';
import ReactJson from 'react-json-view';
import { useFontInfo } from './stories/fontReader';

function App() {
  const [currentValue, setCurrentValue] = useState({});
  const fontSample = useFontInfo(
    // fails 'https://fonts.gstatic.com/s/andika/v19/mem_Ya6iyW-LwqgwZ7YQarw.woff2',
    'Andika-Regular.ttf',
  );
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
        {fontSample && <ReactJson src={fontSample} />}
      </div>
    </div>
  );
}

export default App;
