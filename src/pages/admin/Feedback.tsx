
import React from 'react';
import {
  Box, Typography, Paper, Table, TableContainer,
  TableHead, TableRow, TableCell, TableBody, Chip
} from '@mui/material';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import type { FeedbackEntry } from '../../redux/feedbackSlice';

const Feedback: React.FC = () => {
  const feedbacks: FeedbackEntry[] = useSelector((state: RootState) => state.feedback.entries);

  return (
    <Box sx={{ minHeight: '100vh', px: { xs: 2, sm: 4, md: 6 }, py: 5, background: 'linear-gradient(to bottom right, #f0f4f7, #e3edea)' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#007A33' }}>
        📝 Feedback Overview
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Typography variant="h6" sx={{ px: 3, pt: 3, fontWeight: 'bold', color: '#333' }}>
          Interview Feedback Table
        </Typography>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#007A33' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Skills</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Resume Score</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Interview Video</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Flag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((entry, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? '#f9fbfa' : '#f1f6f5',
                    '&:hover': { backgroundColor: '#e6f5ec' },
                    transition: 'background 0.2s ease-in-out'
                  }}
                >
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.skills}</TableCell>
                  <TableCell>{entry.resumeScore}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      color={
                        entry.status === 'Passed' ? 'success' :
                        entry.status === 'Rejected' ? 'error' : 'warning'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      href={entry.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        padding: '6px 14px',
                        border: '1px solid #1976d2',
                        borderRadius: '4px',
                        color: '#1976d2',
                        fontSize: '0.875rem',
                        fontFamily: 'Roboto, sans-serif',
                        transition: 'background 0.2s ease-in-out',
                        display: 'inline-block'
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = '#e3f2fd')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      Watch Video
                    </a>
                  </TableCell>
                  <TableCell>
                    {entry.aiTrigger === 'AI Trigger' && (
                      <Chip label="Flagged" color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Feedback;