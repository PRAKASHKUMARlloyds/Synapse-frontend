import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { RootState } from '../../store';
import { setEmailId, setName } from '../../redux/resumeAnalysisSlice';
import ResumeAnalysis from '../ResumeAnalysis';

type Candidate = {
  name: string;
  email: string;
  skills: string;
  resumeScore: number | string;
  status: 'Passed' | 'Rejected' | 'Pending';
};

const initialCandidates: Candidate[] = [
  {
    name: 'Aaryan',
    email: 'aaryan@samplegmail.com',
    skills: 'React, Node.js',
    resumeScore: 'N/A',
    status: 'Passed',
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma@gmail.com',
    skills: 'Python, Django',
    resumeScore: 25,
    status: 'Passed',
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@gmail.com',
    skills: 'Java, Spring',
    resumeScore: 30,
    status: 'Rejected',
  },
];

const Candidates: React.FC = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector((state: RootState) => state.resumeAnalysis);

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [form, setForm] = useState({ name: '', email: '', skills: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadResume = () => {
    if (form.name && form.email) {
      dispatch(setName(form.name));
      dispatch(setEmailId(form.email));
      setIsModalOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const isResumeDataValid =
      resumeData?.name &&
      resumeData?.emailId &&
      Array.isArray(resumeData?.skills) &&
      resumeData.skills.length > 0;

    if (!isResumeDataValid) {
      alert('No analysed resume data available. Please upload and analyse a resume first.');
      return;
    }

    const newCandidate: Candidate = {
      name: resumeData.name,
      email: resumeData.emailId,
      skills: resumeData.skills.join(', '),
      resumeScore: resumeData.resumeScore,
      status: resumeData.resumeScore >= 80 ? 'Passed' : 'Rejected',
    };

    setCandidates((prev) => [...prev, newCandidate]);
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#f0f4f7' }}>
      <Typography variant="h4" sx={{ color: '#007A33', fontWeight: 'bold', mb: 3 }}>
        👥 Candidate Management
      </Typography>

      {/* Add New Candidate */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderLeft: '6px solid #007A33' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Candidate
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleUploadResume}>
            Analyze Resume
          </Button>
          <Button variant="contained" sx={{ backgroundColor: '#007A33' }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Paper>

      {/* Candidate Table */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Typography variant="h6" sx={{ p: 3, pb: 0, fontWeight: 'bold' }}>
          Candidate List
        </Typography>
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

      {/* Modal Popup for ResumeAnalysis */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="md">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Resume Analyzer
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ResumeAnalysis />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Candidates;
