import React from 'react';
import { useAsync } from 'react-use';
import { Route, Routes } from 'react-router-dom';
import {
  EmptyState,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { ScorecardDetailsPage } from '../ScorecardDetailsPage';
import { ScorecardList } from './ScorecardList';
import { scorecardsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

export const ScorecardsPage = () => {
  const scorecardsApi = useApi(scorecardsApiRef);

  const {
    value: scorecards,
    loading,
    error,
  } = useAsync(async () => {
      return await scorecardsApi.getScorecards();
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <WarningPanel severity="error" title="Could not load Scorecards.">
        {error.message}
      </WarningPanel>
    );
  }

  if (!scorecards?.data?.length) {
    return (
      <EmptyState
        missing="info"
        title="No scorecards to display"
        description="You haven't added any scorecards yet."
      />
    );
  }

  return (
    <Routes>
      <Route path="/:id" element={<ScorecardDetailsPage />} />
      <Route path="*" element={<ScorecardList />} />
    </Routes>
  );
};
