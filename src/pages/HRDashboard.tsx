import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setDescription } from '../redux/candidateDataSlice';
import FileUpload from '../components/fileupload/FileUpload';

export default function HRDashboard() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const evaluation = useSelector((state: RootState) => state.interview.evaluation);
  console.log(evaluation)

  const onBoardingDetails = useSelector((state: RootState) => state.candidateData.onBoardingDetails);
  const fileName = useSelector((state: RootState) => state.candidateData.onBoardingDetails.fileName);
  const description = useSelector((state: RootState) => state.candidateData.onBoardingDetails.description || '');

  const submitHandler = () => {
    console.log('data', onBoardingDetails, fileName, description);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧑‍💼 HR Dashboard
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        {/* {contentArray.map((item, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {item.text}
            </Typography>
          </Paper>
        ))} */}

        {/* 🔷 Display Interview Evaluation */}
        {evaluation && (
          <Paper elevation={3} sx={{ p: 3, backgroundColor: evaluation.status === 'pass' ? '#e8f5e9' : '#ffebee' }}>
            <Typography variant="h6" gutterBottom>
              📋 Candidate Interview Evaluation
            </Typography>
            <Typography>
              <strong>Score:</strong> {evaluation.score}/100
            </Typography>
            <Typography>
              <strong>Status:</strong>{' '}
              <span style={{ color: evaluation.status === 'pass' ? 'green' : 'red' }}>
                {evaluation.status.toUpperCase()}
              </span>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Feedback:</strong> {evaluation.feedback}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Candidate Onboarding
        </Button>
      </Box> */}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Candidate Onboarding</DialogTitle>
        <DialogContent dividers>
          <Box my={2}>
           
          </Box>

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
          />

          <Box my={2}>
            <FileUpload />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" fullWidth onClick={submitHandler}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}