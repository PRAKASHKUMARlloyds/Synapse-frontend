import React, { useMemo, useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store';
import { updateInterviewDate } from '../../redux/interviewScheduleSlice';

const Schedule: React.FC = () => {
  const dispatch = useDispatch();
  const interviews = useSelector((state: RootState) => state.interviewSchedule.interviews);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState('');

  const filtered = useMemo(() => {
    const lowered = filterText.toLowerCase();
    return interviews.filter(
      item =>
        item.candidate.toLowerCase().includes(lowered) ||
        item.position.toLowerCase().includes(lowered)
    );
  }, [interviews, filterText]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
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
        onChange={(e) => setFilterText(e.target.value)}
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
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Experience</TableCell>
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
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            sx: {
                              backgroundColor: '#f8fcf9',
                              borderRadius: 1,
                              fontSize: '0.9rem',
                              zIndex: 1
                            }
                          }}
                          onChange={(e) =>
                            dispatch(updateInterviewDate({ id, date: e.target.value }))
                          }
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