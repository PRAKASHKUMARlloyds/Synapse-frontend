import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer,
  TableHead, TableRow, TableCell, TableBody, Chip
} from '@mui/material';
import { getCandidateResults } from '../../services/retrieve-results';


interface CandidateResult {
  email: string;
  score: number;
  status: string;
  feedback: string;
}

const Feedback: React.FC = () => {
  const [candidateResults, setCandidateResults] = useState([] as CandidateResult[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCandidateResults();
        console.log('Candidate Results:', data);
        setCandidateResults(data);
      } catch (err) {
        alert('Failed to load evaluations');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', px: { xs: 2, sm: 4, md: 6 }, py: 5, background: '#f9f9f9' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#007A33' }}>
        📋 HR Portal - Interview Evaluations
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#007A33' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Score</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : candidateResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No evaluations found.
                  </TableCell>
                </TableRow>
              ) : (
                candidateResults.map((entry, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? '#f9fbfa' : '#f1f6f5',
                      '&:hover': { backgroundColor: '#e6f5ec' },
                      transition: 'background 0.2s ease-in-out'
                    }}
                  >
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.score}</TableCell>
                    <TableCell>
                      <Chip
                        label={entry.status}
                        color={
                          entry.status.toLowerCase() === 'passed' ? 'success' :
                          entry.status.toLowerCase() === 'rejected' ? 'error' : 'warning'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{entry.feedback}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Feedback;
