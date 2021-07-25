import React from 'react';

import { useApi } from '~/components/api';
import { PageContainer } from '~/components/page';
import { PetsAPI } from '~/types/generated/PetsAPI';

const PetsPage: React.FC = () => {
  const { petsApi } = useApi();

  const [pets, setPets] = React.useState<PetsAPI.Pet[] | null>(null);

  React.useEffect(() => {
    petsApi.get('/pet/findByStatus', { query: { status: 'available' } }).then((res) => {
      setPets(res.data);
    });
  }, [petsApi, setPets]);

  return (
    <PageContainer>
      <div>Available pets:</div>
      <pre>{pets ? JSON.stringify(pets, null, 2) : 'loading...'}</pre>
    </PageContainer>
  );
};

export default PetsPage;
