import { useState } from 'react';
import { TechStackSelector } from '../components/resumeComponents/TechStackSelector';
import { ResumeUploader } from '../components/resumeComponents/ResumeUploader';
import { analyzeResumes } from '../services/analyzeResumes';
import { UploadModeTab } from '../components/resumeComponents/UploadModeTab';
import { UploadedFilesPreview } from '../components/resumeComponents/UploadedFilesPreview';
import { AnalyzeActions } from '../components/resumeComponents/AnalyzeActions';
import { LoadingIndicator } from '../components/resumeComponents/LoadingIndicator';
import { SingleResultDisplay } from '../components/resumeComponents/SingleResultDisplay';
import { BulkResultDisplay } from '../components/resumeComponents/BulkResultDisplay';

const loadingMessages = [
  '🚀 Launching resume into orbit...',
  '⚡ AI neurons firing up!',
  '🔍 Scanning for tech synergy...',
  '🤖 Crunching bytes of brilliance...',
  '💡 Optimizing your potential...'
];

const ResumeAnalysis = () => {
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleResult, setSingleResult] = useState<any | null>(null);

  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleStackSelect = (stack: string) => {
    setSelectedStacks(prev =>
      prev.includes(stack)
        ? prev.filter(s => s !== stack)
        : [...prev, stack]
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
      setLoadingMessageIndex(prev =>
        (prev + 1) % loadingMessages.length
      );
    }, 1500);

    if (activeTab === 'single' && singleFile) {
      const res = await analyzeResumes({ 0: singleFile, length: 1 }, selectedStacks);
      setSingleResult(res[0]);
    } else if (activeTab === 'bulk' && bulkFiles) {
      const res = await analyzeResumes(bulkFiles, selectedStacks);
      setBulkResults(res);
    }

    clearInterval(interval);
    setIsLoading(false);
  };

  const canAnalyze =
    (activeTab === 'single' && singleFile) ||
    (activeTab === 'bulk' && bulkFiles);

  return (
    <>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Resume Analyser</h1>
      <TechStackSelector
        selected={selectedStacks}
        onSelect={handleStackSelect}
      />
      <br />
      <UploadModeTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <br />
      <ResumeUploader
        onUpload={files => handleUpload(files, activeTab)}
        mode={activeTab}
      />
      <UploadedFilesPreview
        activeTab={activeTab}
        singleFile={singleFile}
        bulkFiles={bulkFiles}
      />
      <AnalyzeActions
        canAnalyze={Boolean(canAnalyze)}
        errorMessage={errorMessage}
        onAnalyze={handleAnalyze}
        activeTab={activeTab}
      />
      {isLoading && (
        <LoadingIndicator message={loadingMessages[loadingMessageIndex]} />
      )}
      {(!isLoading && activeTab === 'single' && singleResult) && (
        <SingleResultDisplay
          result={singleResult}
          selectedStacks={selectedStacks}
        />
      )}
      {(!isLoading && activeTab === 'bulk' && bulkResults.length > 0) && (
        <BulkResultDisplay results={bulkResults} />
      )}
    </>
  );
};

export default ResumeAnalysis;
