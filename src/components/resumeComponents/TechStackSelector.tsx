import { Button, Stack } from '@mui/material';

const techStacks = ['React', 'Node.js', 'Python', 'Java', 'AWS'];

interface Props {
  selected: string[];
  onSelect: (stack: string) => void;
}

export const TechStackSelector = ({ selected, onSelect }: Props) => (
  <Stack direction="row" spacing={2} flexWrap="wrap">
    {techStacks.map((stack) => {
      const isSelected = selected.includes(stack);
      return (
        <Button
          key={stack}
          variant={isSelected ? 'contained' : 'outlined'}
          onClick={() => onSelect(stack)}
          sx={{
            borderColor: '#007A33',
            color: isSelected ? '#fff' : '#007A33',
            backgroundColor: isSelected ? '#007A33' : 'transparent',
            '&:hover': {
              borderColor: '#005f27',
              backgroundColor: isSelected ? '#005f27' : '#e6f5ee',
            },
          }}
        >
          {stack}
        </Button>
      );
    })}
  </Stack>
);
