import { useState } from 'react';
import { Container, Typography, Paper, Box, Divider, IconButton, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // 🔄 import refresh icon
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store.ts';

import { TechStackSelector } from '../components/resumeComponents/TechStackSelector';
import { analyzeResumes } from '../services/analyze-resumes.ts';
import { UploadModeTab } from '../components/resumeComponents/UploadModeTab';
import { UploadedFilesPreview } from '../components/resumeComponents/UploadedFilesPreview';
import { AnalyzeActions } from '../components/resumeComponents/AnalyzeActions';
import { LoadingIndicator } from '../components/resumeComponents/LoadingIndicator';
import { SingleResultDisplay } from '../components/resumeComponents/SingleResultDisplay';
import { BulkResultDisplay } from '../components/resumeComponents/BulkResultDisplay';

import { setCandidateData } from '../redux/resumeAnalysisSlice.tsx';
import { addInterview } from '../redux/interviewScheduleSlice.tsx';

const loadingMessages = [
  '🚀 Launching resume into orbit...',
  '⚡ AI neurons firing up!',
  '🔍 Scanning for tech synergy...',
  '🤖 Crunching bytes of brilliance...',
  '💡 Optimizing your potential...',
];

const ResumeAnalysis = () => {
  const dispatch = useDispatch();
  const { name, emailId } = useSelector((state: RootState) => state.resumeAnalysis);
  const resumeData = useSelector((state: RootState) => state.resumeAnalysis);

  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleResult, setSingleResult] = useState<any | null>(null);

  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleReload = () => {
    // Full page reload
    window.location.reload();
  };

  const handleStackSelect = (stack: string) => {
    setSelectedStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  };

  const handleUpload = (files: FileList, mode: 'single' | 'bulk') => {
    setIsLoading(false);
    setErrorMessage('');
    setLoadingMessageIndex(0);
    setBulkResults([]);
    if (mode === 'single') {
      setSingleFile(files[0] ?? null);
    } else {
      setBulkFiles(files);
    }
  };

  const handleAnalyze = async () => {
    if (selectedStacks.length === 0) {
      setErrorMessage('▲ Please select at least one tech stack to analyze.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    if (activeTab === 'single' && singleFile) {
      const fileList: FileList = {
        0: singleFile,
        length: 1,
        item: (index: number) => (index === 0 ? singleFile : null),
      } as unknown as FileList;

      const res = await analyzeResumes(fileList, selectedStacks);
      const result = res[0];

      if (resumeData) {
        dispatch(
          setCandidateData({
            name,
            emailId,
            skills: selectedStacks,
            resumeScore: result.relevance,
            status: result.relevance > 80 ? 'Rejected' : 'Passed',
          })
        );

        dispatch(
          addInterview({
            id: 7,
            candidate: name,
            position: 'Software Engineer',
            date: '',
            experience: '2 years',
          })
        );
      }

      setSingleResult(result);
    } else if (activeTab === 'bulk' && bulkFiles) {
      const res = await analyzeResumes(bulkFiles, selectedStacks);
      setBulkResults(res);
    }

    clearInterval(interval);
    setIsLoading(false);
  };

  const canAnalyze = (activeTab === 'single' && singleFile) || (activeTab === 'bulk' && bulkFiles);

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
      {/* 🔄 Reload button */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <IconButton
          onClick={handleReload}
          sx={{
            backgroundColor: 'white',
            color: '#007A33',
            boxShadow: 1,
            borderRadius: 1,
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
        📄 Resume Analyzer
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          p: { xs: 2, sm: 3 },
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <TechStackSelector selected={selectedStacks} onSelect={handleStackSelect} />

        <Box sx={{ my: 3 }}>
          <UploadModeTab activeTab={activeTab} setActiveTab={setActiveTab} />
        </Box>

        <UploadedFilesPreview activeTab={activeTab} singleFile={singleFile} bulkFiles={bulkFiles} />

        <AnalyzeActions
          canAnalyze={Boolean(canAnalyze)}
          errorMessage={errorMessage}
          onAnalyze={handleAnalyze}
          activeTab={activeTab}
        />

        {isLoading && <LoadingIndicator message={loadingMessages[loadingMessageIndex]} />}

        {!isLoading && activeTab === 'single' && singleResult && (
          <SingleResultDisplay result={singleResult} selectedStacks={selectedStacks} />
        )}

        {!isLoading && activeTab === 'bulk' && bulkResults.length > 0 && (
          <BulkResultDisplay results={bulkResults} />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            component="label"
            variant="outlined"
            size="small"
            startIcon={<CloudUploadIcon fontSize="small" />}
            sx={{
              fontWeight: 500,
              borderRadius: 2,
              borderColor: '#007A33',
              color: '#007A33',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              '&:hover': {
                backgroundColor: '#e6f2ec',
                borderColor: '#005824',
                color: '#005824',
              },
            }}
          >
            Upload
            <input
              type="file"
              hidden
              multiple={activeTab === 'bulk'}
              onChange={(e) => {
                if (e.target.files) {
                  handleUpload(e.target.files, activeTab);
                }
              }}
            />
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeAnalysis;
