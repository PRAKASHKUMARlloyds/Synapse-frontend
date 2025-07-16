import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

type Candidate = {
  name: string;
  email: string;
  skills: string;
  resumeScore: number | string;
  status: 'Passed' | 'Rejected' | 'Pending';
};

const initialCandidates: Candidate[] = [
  { name: 'Aaryan', email: 'aaryan@samplegmail.com', skills: 'React, Node.js', resumeScore: 'N/A', status: 'Passed' },
  { name: 'Priya Verma', email: 'priya.verma@gmail.com', skills: 'Python, Django', resumeScore: 25, status: 'Passed' },
  { name: 'Rohan Mehta', email: 'rohan.mehta@gmail.com', skills: 'Java, Spring', resumeScore: 30, status: 'Rejected' }
];

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [form, setForm] = useState({ name: '', email: '', skills: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.name && form.email && form.skills) {
      const newCandidate: Candidate = {
        ...form,
        resumeScore: 'N/A',
        status: 'Pending'
      };
      setCandidates([...candidates, newCandidate]);
      setForm({ name: '', email: '', skills: '' });
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f0f4f7' }}>
      <Typography variant="h4" sx={{ color: '#007A33', fontWeight: 'bold', mb: 3 }}>
        👥 Candidate Management
      </Typography>

      {/* Add New Candidate */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderLeft: '6px solid #007A33' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Candidate</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Skills (comma-separated)"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary">Upload Resume</Button>
          <Button variant="contained" sx={{ backgroundColor: '#007A33' }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Candidate Table */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Typography variant="h6" sx={{ p: 3, pb: 0, fontWeight: 'bold' }}>Candidate List</Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#007A33' }}>
              <TableCell sx={{ color: '#fff' }}>Name</TableCell>
              <TableCell sx={{ color: '#fff' }}>Email</TableCell>
              <TableCell sx={{ color: '#fff' }}>Skills</TableCell>
              <TableCell sx={{ color: '#fff' }}>Resume Score</TableCell>
              <TableCell sx={{ color: '#fff' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow key={index}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.skills}</TableCell>
                <TableCell>{candidate.resumeScore}</TableCell>
                <TableCell>
                  <Chip
                    label={candidate.status}
                    color={
                      candidate.status === 'Passed'
                        ? 'success'
                        : candidate.status === 'Rejected'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Candidates;