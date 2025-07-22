import { Box, Button, Typography } from '@mui/material';

interface AnalyzeActionsProps {
  canAnalyze: boolean;
  errorMessage: string;
  onAnalyze: () => void;
  activeTab: 'single' | 'bulk';
}

export const AnalyzeActions = ({
  canAnalyze,
  errorMessage,
  onAnalyze,
  activeTab,
}: AnalyzeActionsProps) =>
  canAnalyze && (
    <Box mt={2}>
      <Button variant="contained" onClick={onAnalyze}>
        Analyze Resume{activeTab === 'bulk' ? 's' : ''}
      </Button>
      {errorMessage && (
        <Typography variant="body2" color="error" mt={1}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
