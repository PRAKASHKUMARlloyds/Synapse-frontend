import { Button, Stack } from '@mui/material';

const techStacks = ['React', 'Node.js', 'Python', 'Java', 'AWS'];

interface Props {
  selected: string[];
  onSelect: (stack: string) => void;
}

export const TechStackSelector = ({ selected, onSelect }: Props) => (
  <Stack direction="row" spacing={2}>
    {techStacks.map(stack => (
      <Button
        key={stack}
        variant={selected.includes(stack) ? 'contained' : 'outlined'}
        onClick={() => onSelect(stack)}
      >
        {stack}
      </Button>
    ))}
  </Stack>
);
