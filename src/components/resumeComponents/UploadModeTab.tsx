import { Button, Stack } from '@mui/material';

interface Props {
  activeTab: 'single' | 'bulk';
  setActiveTab: (mode: 'single' | 'bulk') => void;
}

export const UploadModeTab = ({ activeTab, setActiveTab }: Props) => (
  <Stack direction="row" spacing={2}>
    <Button
      variant={activeTab === 'single' ? 'contained' : 'outlined'}
      onClick={() => setActiveTab('single')}
      sx={{
        backgroundColor: activeTab === 'single' ? '#007A33' : 'transparent',
        color: activeTab === 'single' ? '#fff' : '#007A33',
        borderColor: '#007A33',
        '&:hover': {
          backgroundColor: activeTab === 'single' ? '#005f27' : '#e6f2ec',
        },
      }}
    >
      Single Upload
    </Button>
    <Button
      variant={activeTab === 'bulk' ? 'contained' : 'outlined'}
      onClick={() => setActiveTab('bulk')}
      sx={{
        backgroundColor: activeTab === 'bulk' ? '#007A33' : 'transparent',
        color: activeTab === 'bulk' ? '#fff' : '#007A33',
        borderColor: '#007A33',
        '&:hover': {
          backgroundColor: activeTab === 'bulk' ? '#005f27' : '#e6f2ec',
        },
      }}
    >
      Bulk Upload
    </Button>
  </Stack>
);
