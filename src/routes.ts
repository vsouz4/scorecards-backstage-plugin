import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'scorecards',
});

export const scorecardRouteRef = createSubRouteRef({
  id: 'scorecard',
  path: '/:id',
  parent: rootRouteRef,
});
