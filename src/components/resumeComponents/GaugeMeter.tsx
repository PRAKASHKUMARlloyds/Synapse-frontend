import { Box, Typography } from '@mui/material';
import ReactSpeedometer from 'react-d3-speedometer';

interface Props {
  relevance: number; // 0-100
}

export const SpeedometerMeter = ({ relevance }: Props) => (
  <Box textAlign="center" mt={4}>
    <Typography variant="h6" gutterBottom>
      Relevance Score
    </Typography>
    <ReactSpeedometer
      maxValue={100}
      value={relevance}
      needleColor="#444"
      startColor="#FF5F6D"
      segments={5}
      segmentColors={[
        "#FF5F6D",
        "#FFC371",
        "#FFD700",
        "#9ACD32",
        "#00C49F",
      ]}
      endColor="#00C49F"
      currentValueText={`${relevance}%`}
      height={240}
      width={360}
      ringWidth={20}
    />
  </Box>
);
