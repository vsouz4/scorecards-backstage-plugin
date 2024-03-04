import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  configApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef, scorecardRouteRef } from './routes';
import { scorecardsApiRef, ScorecardsApi } from './api';

export const scorecardsPlugin = createPlugin({
  id: 'scorecards',
  routes: {
    root: rootRouteRef,
    scorecard: scorecardRouteRef,
  },
  apis: [
    createApiFactory({
      api: scorecardsApiRef,
      deps: {
        configApi: configApiRef,
      },
      factory: ({ configApi }) => {
        return new ScorecardsApi({
          configApi,
        });
      },
    }),
  ],
});

export const ScorecardsPage = scorecardsPlugin.provide(
  createRoutableExtension({
    name: 'ScorecardsPage',
    component: () =>
      import('./components/ScorecardsHomepageComponent').then(m => m.ScorecardsHomepageComponent),
    mountPoint: rootRouteRef,
  }),
);
