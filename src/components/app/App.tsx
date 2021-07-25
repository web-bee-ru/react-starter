import React from 'react';

import '~/assets/main.scss';
import { ApiProvider } from '~/components/api';
import { AppRouter } from '~/components/app';
import { config } from '~/lifecycle/config';

export interface AppProps {
  basePath?: string;
}

const App = ({ basePath }: AppProps) => {
  return (
    <ApiProvider petsApiBaseUrl={config.PETS_API_BASE_URL}>
      <AppRouter basePath={basePath} />;
    </ApiProvider>
  );
};

export default App;
