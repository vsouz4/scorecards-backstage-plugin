import React from 'react';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { scorecardRouteRef } from '../../routes';
import { useAsync } from 'react-use';
import {
  Table,
  TableColumn,
  Progress,
  InfoCard,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ScorecardDetails } from './ScorecardDetails';
import { scorecardsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { Gauge } from '../Common';
import { Typography, Grid, Box, Tooltip } from '@material-ui/core';

type Evaluation = {
  score: number;
  catalog: {
    title: string;
  };
  level: {
    name: string;
    color: string;
  };
};

type DenseTableProps = {
  evaluations: Evaluation[];
};

export const DenseTable = ({ evaluations }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Score', field: 'score' },
    { title: 'Level', field: 'level' },
  ];

  const data = evaluations.map(evaluation => {
    return {
      name: evaluation.catalog.title,
      score: (
          <Gauge value={evaluation.score} />
      ),
      level: evaluation.level?.name,
      level: (
        {evaluation.level && <Tooltip title={evaluation.level.name}>
          <Box display="flex" flexDirection="row" alignItems={'center'}>
            <StarIcon
              style={{
                color: {evaluation.level.color}
              }}
            />
          </Box>
        </Tooltip>}
      ),
    };
  });

  return (
    <Table
      title="Evaluations"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

export const ScorecardDetailsPage = () => {
  const { id: scorecardId } = useRouteRefParams(scorecardRouteRef);
  const scorecardsApi = useApi(scorecardsApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Evaluation[]> => {
    return await scorecardsApi.getEvaluations(scorecardId);
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InfoCard title={value.data.name}>
            <Typography variant="body1">
              Filter rule: {value.data.filterRule}
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item>
          <DenseTable evaluations={value.data.evaluations || []} />;
        </Grid>
      </Grid>
    </Content>
  );
};
