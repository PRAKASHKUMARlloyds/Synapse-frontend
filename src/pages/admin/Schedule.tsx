import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type Interview = {
  id: number;
  candidate: string;
  position: string;
  date: string;
  experience: string;
};

const Schedule: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filtered, setFiltered] = useState<Interview[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const data = [
      { id: 1, candidate: 'Aakar Sharma', position: 'Software Engineer', date: '2023-08-15', experience: '1 year' },
      { id: 2, candidate: 'Priya Verma', position: 'Product Manager', date: '2023-08-16', experience: '3 years' },
      { id: 3, candidate: 'Rakesh Mehta', position: 'UX Designer', date: '2023-08-17', experience: '4 years' },
      { id: 4, candidate: 'Sneha Iyer', position: 'QA Engineer', date: '2023-08-18', experience: '5 years' },
      { id: 5, candidate: 'Karan Patel', position: 'DevOps Engineer', date: '2023-08-19', experience: '7 years' }
    ];
    setInterviews(data);
    setFiltered(data);
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = (value: string) => {
    setFilterText(value);
    const lowered = value.toLowerCase();
    setFiltered(
      interviews.filter(
        (item) =>
          item.candidate.toLowerCase().includes(lowered) ||
          item.position.toLowerCase().includes(lowered)
      )
    );
    setPage(0);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(to bottom right, #f0f4f7, #e3edea)',
        py: 5,
        px: { xs: 2, sm: 4, md: 6 }
      }}
    >
      <Typography variant="h4" sx={{ color: '#007A33', fontWeight: 'bold', mb: 2 }}>
        📅 Interview Schedule
      </Typography>

      <TextField
        placeholder="Filter by candidate or position"
        value={filterText}
        onChange={(e) => handleFilter(e.target.value)}
        fullWidth
        sx={{ mb: 3, backgroundColor: '#fff', borderRadius: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          )
        }}
      />

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', backgroundColor: '#fff' }}>
        <Typography variant="h6" sx={{ px: 3, pt: 3, pb: 1, fontWeight: 'bold', color: '#333' }}>
          Interview Schedule Table
        </Typography>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#007A33' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Candidate</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Position</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Scheduled Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total Experience</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No matching interviews found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(({ id, candidate, position, date, experience }, index) => (
                    <TableRow
                      key={id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f9fbfa' : '#f1f6f5',
                        '&:hover': { backgroundColor: '#e6f5ec' },
                        transition: 'background 0.2s ease-in-out'
                      }}
                    >
                      <TableCell>{candidate}</TableCell>
                      <TableCell>{position}</TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          value={date}
                          size="small"
                          variant="outlined"
                          InputProps={{
                            sx: {
                              backgroundColor: '#f8fcf9',
                              borderRadius: 1,
                              fontSize: '0.9rem'
                            }
                          }}
                          onChange={(e) => {
                            const updatedDate = e.target.value;
                            setInterviews((prev) =>
                              prev.map((item) =>
                                item.id === id ? { ...item, date: updatedDate } : item
                              )
                            );
                            handleFilter(filterText);
                          }}
                        />
                      </TableCell>
                      <TableCell>{experience}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
            px: 2,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        />
      </Paper>
    </Box>
  );
};

export default Schedule;