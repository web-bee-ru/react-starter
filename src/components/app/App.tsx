import React from 'react';

import '~/assets/main.scss';
import { AppRouter } from '~/components/app';

export interface AppProps {
  basePath?: string;
}

const App = ({ basePath }: AppProps) => {
  return <AppRouter basePath={basePath} />;
};

export default App;
