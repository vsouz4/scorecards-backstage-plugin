import React from 'react';
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from '@material-ui/core';
import { useAsync } from 'react-use';
import {
  Button,
  Content,
  ContentHeader,
  ItemCardGrid,
  ItemCardHeader,
  MarkdownContent,
  EmptyState,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { scorecardRouteRef } from '../../routes';
import { ScorecardDetailsPage } from '../ScorecardDetailsPage';
import { scorecardsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

export const ScorecardList = () => {
  const scorecardRef = useRouteRef(scorecardRouteRef);
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
    <Content>
      <Grid container direction="column">
        <Grid item lg={12}>
          <ItemCardGrid>
          {scorecards.data.map(scorecard => (
            <Card key={scorecard.id}>
              <CardMedia>
                <ItemCardHeader title={`Scorecard #${scorecard.id}`} />
              </CardMedia>
              <CardContent>
                  <MarkdownContent content={scorecard.name} />
              </CardContent>
              <CardActions>
                <Button to={scorecardRef({ id: `${scorecard.id}` })} color="primary">
                  Details
                </Button>
              </CardActions>
            </Card>
          ))}
          </ItemCardGrid>
        </Grid>
      </Grid>
    </Content>
  );
};
