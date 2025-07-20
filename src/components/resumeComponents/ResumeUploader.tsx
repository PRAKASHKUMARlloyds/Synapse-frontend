import { Button, Stack } from '@mui/material';

interface Props {
  onUpload: (files: FileList) => void;
  mode: 'single' | 'bulk';
}

export const ResumeUploader = ({ onUpload, mode }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (mode === 'single' && files.length > 1) {
      alert('Please upload only one file in Single mode.');
      return;
    }

    onUpload(files);
  };

  return (
    <Stack spacing={2}>
      <Button variant="contained" component="label">
        {mode === 'single' ? 'Upload Resume' : 'Upload Resumes'}
        <input
          type="file"
          hidden
          multiple={mode === 'bulk'}
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
        />
      </Button>
    </Stack>
  );
};
