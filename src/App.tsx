import './App.css';
import { css } from '@emotion/react';
import React, { useState } from 'react';

import logo from './logo.svg';
import { BloomCollection } from './stories/stories';

function App() {
  const [count, setCount] = useState(0);

  // Currently I can't get emotion's css prop to work when run by storybook,
  // so I'm running stories from here.
  return <BloomCollection />;
}

export default App;
