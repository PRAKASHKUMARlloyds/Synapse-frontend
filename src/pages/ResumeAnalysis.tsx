import { useState } from 'react';
import { TechStackSelector } from '../components/resumeComponents/TechStackSelector';
import { ResumeUploader } from '../components/resumeComponents/ResumeUploader';
import { analyzeResumes } from '../services/analyze-resumes.ts';
import { UploadModeTab } from '../components/resumeComponents/UploadModeTab';
import { UploadedFilesPreview } from '../components/resumeComponents/UploadedFilesPreview';
import { AnalyzeActions } from '../components/resumeComponents/AnalyzeActions';
import { LoadingIndicator } from '../components/resumeComponents/LoadingIndicator';
import { SingleResultDisplay } from '../components/resumeComponents/SingleResultDisplay';
import { BulkResultDisplay } from '../components/resumeComponents/BulkResultDisplay';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store.ts';
import {
  setCandidateData,
} from '../redux/resumeAnalysisSlice.tsx';

const loadingMessages = [
  '🚀 Launching resume into orbit...',
  '⚡ AI neurons firing up!',
  '🔍 Scanning for tech synergy...',
  '🤖 Crunching bytes of brilliance...',
  '💡 Optimizing your potential...',
];

const ResumeAnalysis = () => {
  const navigate = useNavigate();
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

  const handleClose = () => {
    // Clear state if needed before navigation
    setSingleFile(null);
    setSingleResult(null);
    setBulkFiles(null);
    setBulkResults([]);
    setErrorMessage('');
    navigate('/admin/candidates');
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
      console.log(
        'REsume results' +
          result.skills +
          'Details:\n' +
          result.details +
          result.name +
          result.relevance
      );
   
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
        //  dispatch(
        // setResumeAnalysis({
        //   name: resumeData.name,
        //   email: resumeData.email,
        //   skills: result.skills,
        //   resumeScore: result.resumeScore,
        //   status: result.status,
        // })
        // );
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
    <>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Resume Analyser</h1>
      <TechStackSelector selected={selectedStacks} onSelect={handleStackSelect} />
      <br />
      <UploadModeTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <br />
      <ResumeUploader onUpload={(files) => handleUpload(files, activeTab)} mode={activeTab} />
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
      <div
        style={{
          marginLeft: '250px', // adjust to match sidebar width
          padding: '2rem',
          minHeight: '100vh',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007A33',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ResumeAnalysis;
