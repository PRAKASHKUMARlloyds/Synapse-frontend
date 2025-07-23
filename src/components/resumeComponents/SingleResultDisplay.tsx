import { Box, Stack, Typography } from '@mui/material';
import { SpeedometerMeter } from './GaugeMeter';

interface TechStack {
  result: any;
  selectedStacks: string[];
}

export const SingleResultDisplay = ({ result, selectedStacks }: TechStack) => (
  <Box mt={4}>
    <SpeedometerMeter relevance={result.relevance} />

    <Typography variant="h6" mt={4} gutterBottom>
      Tech-Stack Analysis Summary
    </Typography>

    <Stack spacing={2}>
      {selectedStacks.map((stack) => {
        const data = result.details?.find((d: any) => d.name === stack);
        if (!data) return null;
        const stars = '⭐️'.repeat(data.proficiency);

        return (
          <Box key={stack} p={2} border="1px solid #ccc" borderRadius={2}>
            <Typography variant="subtitle1">
              <strong>{stack}</strong> {stars} ({data.proficiency}/10)
            </Typography>
            <ol style={{ margin: 0, paddingLeft: '1.5rem', textAlign: 'left' }}>
              {data.positiveStatements.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ol>
          </Box>
        );
      })}
    </Stack>
  </Box>
);
