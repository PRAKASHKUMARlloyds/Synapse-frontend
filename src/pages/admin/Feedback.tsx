import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer,
  TableHead, TableRow, TableCell, TableBody, Chip
} from '@mui/material';
import { getCandidateResults } from '../../services/retrieve-results';

interface CandidateResult {
  name: string;
  email: string;
  score: number;
  status: string;
  feedback: string;
}

const Feedback: React.FC = () => {
  const [candidateResults, setCandidateResults] = useState<CandidateResult[]>([]);
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

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pass') return '#4caf50';       // green
    if (s === 'fail' || s === 'failed' || s === 'rejected') return '#ff9800'; // yellow
    return '#f44336';                           // red fallback
  };

  const StatusCircle = ({ status }: { status: string }) => (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        bgcolor: getStatusColor(status),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        mx: 'auto',
      }}
    >
      {status}
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 4, md: 6 },
        py: 5,
        background: '#f9f9f9',
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 'bold', color: '#007A33' }}
      >
        📋 HR Portal - Interview Evaluations
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#007A33', color: '#fff', fontWeight: 'bold' }}>
                  Name
                </TableCell>
                <TableCell sx={{ bgcolor: '#007A33', color: '#fff', fontWeight: 'bold' }}>
                  Email
                </TableCell>
                <TableCell sx={{ bgcolor: '#007A33', color: '#fff', fontWeight: 'bold' }}>
                  Score
                </TableCell>
                <TableCell sx={{ bgcolor: '#007A33', color: '#fff', fontWeight: 'bold' }}>
                  Status
                </TableCell>
                <TableCell sx={{ bgcolor: '#007A33', color: '#fff', fontWeight: 'bold' }}>
                  Feedback
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : candidateResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
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
                      transition: 'background 0.2s ease-in-out',
                    }}
                  >
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.score}</TableCell>
                    <TableCell>
                      <StatusCircle status={entry.status} />
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
