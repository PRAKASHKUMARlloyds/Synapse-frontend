import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust the import based on your store setup
import './FileUpload.css'; // Import the CSS file
import React from 'react';
import { setFileName } from '../../redux/candidateDataSlice';

export default function FileUpload() {
  const dispatch = useDispatch();
  const fileName = useSelector((state: RootState) => state.candidateData.onBoardingDetails.fileName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    if (acceptedFiles.length > 0) {
      console.log('fileeeeeeeeeeeeeeeee', acceptedFiles[0]);
      dispatch(setFileName(acceptedFiles[0].name));
      setError(null); // Reset error state
    }
  }, [dispatch]);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10485760, // 10 MB
    onDropRejected: () => setError('File size exceeds the 10 MB limit.'),
  });

  const handleRemoveFile = () => {
    dispatch(setFileName(null));
    setError(null); // Reset error state
  };

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (typeof acceptedFiles[0] === 'undefined') return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('upload_preset', '<Your Upload Preset>');
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      const results = await fetch('https://api.cloudinary.com/v1_1/<Your Cloud Name>/image/upload', {
        method: 'POST',
        body: formData,
      }).then((r) => r.json());

      console.log('results', results);
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>{isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop a file here, or click to select a file</p>}</p>
      </div>

      {fileName && (
        <div className="file-name">
          <span>Selected file: {fileName}</span>
          <IconButton onClick={handleRemoveFile} aria-label="remove file">
            <CloseIcon />
          </IconButton>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </>
  );
}
