import React from 'react';

import { MainLink } from '~/components/navigation';
import { Routes } from '~/lib/routes';

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <div>
      <div>
        <div>
          <MainLink to={Routes.HOME}>HOME</MainLink>
        </div>
        <div>
          <MainLink to={Routes.TEST}>TEST</MainLink>
        </div>
        <div>
          <MainLink to={Routes.PETS}>PETS</MainLink>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DefaultLayout;
