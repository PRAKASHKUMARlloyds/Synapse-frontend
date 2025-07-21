import {
  Table,TableBody,TableCell,TableHead,TableRow,Paper,List,ListItem
} from '@mui/material';

interface ResumeResult {
  name: string;
  relevance: number;
  positives: string[];
  rating: number;
}

interface Props {
  results: ResumeResult[];
  onSelect: (result: ResumeResult) => void;
}

export const ResumeTable = ({ results, onSelect }: Props) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Relevance</TableCell>
          <TableCell>Positives</TableCell>
          <TableCell>Rating</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map(res => (
          <TableRow
            key={res.name}
            onClick={() => onSelect(res)}
            hover
          >
            <TableCell>{res.name}</TableCell>
            <TableCell>{res.relevance}</TableCell>
            <TableCell>
              <List dense>
                {res.positives.map((point, index) => (
                  <ListItem key={index}>{point}</ListItem>
                ))}
              </List>
            </TableCell>
            <TableCell>{res.rating}/10</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);
