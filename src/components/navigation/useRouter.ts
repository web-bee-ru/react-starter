import React from 'react';
import { useLocation, useRouteMatch, useHistory, useParams } from 'react-router-dom';

function useQuery(search: string) {
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function useRouter() {
  const location = useLocation();
  const routeMatch = useRouteMatch();
  const history = useHistory();
  const params = useParams<Partial<Record<string, string>>>();
  const query = useQuery(location.search);

  const router = React.useMemo(
    () => ({
      location,
      routeMatch,
      history,
      params,
      query,
    }),
    [location, routeMatch, history, params, query],
  );

  return router;
}

export { useRouter };
