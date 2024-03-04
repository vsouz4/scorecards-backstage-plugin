import React from 'react';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { scorecardRouteRef } from '../../routes';
import { useAsync } from 'react-use';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { ScorecardDetails } from './ScorecardDetails';
import { scorecardsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

type Evaluation = {
  score: number;
  catalog: {
    title: string;
  };
  level: {
    name: string;
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
      score: evaluation.score,
      level: evaluation.level?.name,
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

  return <DenseTable evaluations={value.data.evaluations || []} />;
};
