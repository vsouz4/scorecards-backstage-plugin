import React from 'react';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { ScorecardsPage } from '../ScorecardsPage';

export const ScorecardsHomepageComponent = () => (
  <Page themeId="tool">
    <Header title="Scorecards" subtitle="Discover useful information about your software catalog">
    </Header>
    <Content>
      <ScorecardsPage />
    </Content>
  </Page>
);
