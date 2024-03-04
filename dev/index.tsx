import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { scorecardsPlugin, ScorecardsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(scorecardsPlugin)
  .addPage({
    element: <ScorecardsPage />,
    title: 'Scorecards',
    path: '/scorecards',
  })
  .render();
