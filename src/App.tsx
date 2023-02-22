import './App.css';
import { css } from '@emotion/react';
import { useState } from 'react';

import { BloomCollection } from './stories/bloom.stories';
// import { Lameta, Pets } from './stories/Other.stories';

function App() {
  const [currentValue, setCurrentValue] = useState({});
  // Having an app here is a holdover from when I couldn't get emotion css props to work with storybook.
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <BloomCollection />
      {/* <Lameta></Lameta> */}
      {/* <Pets></Pets> */}
    </div>
  );
}

export default App;
