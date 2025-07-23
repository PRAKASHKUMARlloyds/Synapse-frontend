import { Typography, Box } from '@mui/material';

interface UploadedFilesPreviewProps {
  activeTab: 'single' | 'bulk';
  singleFile: File | null;
  bulkFiles: FileList | null;
}

export const UploadedFilesPreview = ({
  activeTab,
  singleFile,
  bulkFiles,
}: UploadedFilesPreviewProps) => {
  if (activeTab === 'single' && singleFile) {
    return (
      <Typography variant="body2" mt={1}>
        📄 Uploaded file: <strong>{singleFile.name}</strong>
      </Typography>
    );
  }

  if (activeTab === 'bulk' && bulkFiles) {
    return (
      <Box mt={1}>
        <Typography variant="body2">
          📄 Uploaded {bulkFiles.length} file
          {bulkFiles.length > 1 ? 's' : ''}:
        </Typography>
        <ul style={{ marginTop: '0.3rem', marginLeft: '1rem' }}>
          {Array.from(bulkFiles).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      </Box>
    );
  }

  return null;
};
