import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { scorecardRouteRef } from '../../routes';
import { useAsync } from 'react-use';
import {
  Content,
  Progress,
  InfoCard,
  ResponseErrorPanel,
  MarkdownContent,
} from '@backstage/core-components';
import { ScorecardDetails } from './ScorecardDetails';
import { scorecardsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { Gauge } from '../Common';
import {
    Typography,
    Grid,
    Box,
    Tooltip,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.scorePercentage}</TableCell>
        <TableCell>{row.level}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small">
                <TableBody>
                  {row.rules.map((rule) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {rule.passing ? (
                          <CheckIcon color="primary" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={rule.rule}>
                          <Box display="flex" flexDirection="row" alignItems={'center'}>
                              {rule.name}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{rule.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function ScorecardRuleRow(props) {
  const { rule } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <Grid item lg={10}>
        <Tooltip title={rule.rule}>
          <Box display="flex" flexDirection="row" alignItems={'center'}>
              {rule.name}
          </Box>
        </Tooltip>
      </Grid>
      <Grid item lg={1}>
        <b>{rule.points}</b>
      </Grid>
    </React.Fragment>
  );
}

function LevelRow(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.color}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container>
                {row.rules.map(rule => (
                  <ScorecardRuleRow key={rule.name} rule={rule} />
                ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

type EvaluationRule = {
  name: string;
  points: number;
  passing: boolean;
}

type Level = {
    name: string;
    color: string;
};

type Evaluation = {
  scorePercentage: number;
  catalog: {
    title: string;
  };
  level: Level;
  rules: EvaluationRule[];
};

type ScoresTableProps = {
  evaluations: Evaluation[];
};

export const ScoresTable = ({ evaluations }: ScoresTableProps) => {
  const data = evaluations.map(evaluation => {
    const level = evaluation.level;
    const levelName = evaluation.level?.name;
    const levelColor = evaluation.level?.color;

    return {
      name: evaluation.catalog.title,
      scorePercentage: (
          <Gauge value={evaluation.scorePercentage} />
      ),
      level: (
        <>
            {level && (<Tooltip title={levelName}>
              <Box display="flex" flexDirection="row" alignItems={'center'}>
                <StarIcon
                  style={{
                    color: `#${levelColor}`
                  }}
                />
              </Box>
            </Tooltip>)}
        </>
      ),
      rules: evaluation.rules
    };
  });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type LevelsTableProps = {
  levels: Level[];
};

export const LevelsTable = ({ levels }: LevelsTableProps) => {
  const data = levels.map(level => {
    const levelName = level.name;
    const levelColor = level.color;

    return {
      name: level.name,
      color: (
        <Tooltip title={levelName}>
          <Box display="flex" flexDirection="row" alignItems={'center'}>
            <StarIcon
              style={{
                color: `#${levelColor}`
              }}
            />
          </Box>
        </Tooltip>
      ),
      rules: level.rules
    };
  });

  return (
    <InfoCard title="Levels">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableBody>
              {data.map((row) => (
                <LevelRow key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </InfoCard>
  );
};

type Rule = {
  name: string;
  rule: string;
  points: number;
};

type RulesListProps = {
  rules: Rule[];
};

export const RulesList = ({ rules }: RulesListProps) => {
  return (
    <InfoCard title="Rules">
      <Grid container>
        {rules.map(rule => (
          <ScorecardRuleRow key={rule.name} rule={rule} />
        ))}
      </Grid>
    </InfoCard>
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
          <Grid container direction="row" spacing="1">
            <Grid item lg={4} xs={12}>
              <Grid container spacing={3} direction="column">
                {value.data.levels?.length > 0 ? (
                <Grid item>
                    <LevelsTable levels={value.data.levels} />
                </Grid>
                ) : (
                <Grid item>
                    <RulesList rules={value.data.rules} />
                </Grid>)}
              </Grid>
            </Grid>
            <Grid item lg={8} xs={12}>
              <ScoresTable evaluations={value.data.evaluations || []} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Content>
  );
};
