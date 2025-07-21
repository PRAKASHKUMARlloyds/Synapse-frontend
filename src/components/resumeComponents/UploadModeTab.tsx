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
    >
      Single Upload
    </Button>
    <Button
      variant={activeTab === 'bulk' ? 'contained' : 'outlined'}
      onClick={() => setActiveTab('bulk')}
    >
      Bulk Upload
    </Button>
  </Stack>
);
