import React from 'react';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export function getProgressColor(value: number) {
  if (value < 25) {
    return '#c92920';
  } else if (value < 50) {
    return '#faa716';
  } else if (value < 70) {
    return '#cfd43b';
  } else if (value == 100) {
    return '#2ba327'
  }

  return '#7bd667';
}

interface GaugeProps {
  value: number;
}

export const Gauge = ({ value }: GaugeProps) => {
    return (
        <div>
            <CircularProgressWithLabel variant="determinate" style={{'color': getProgressColor(value)}} value={value} />
        </div>
   );
};
