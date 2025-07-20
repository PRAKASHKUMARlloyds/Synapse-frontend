import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import type { SelectChangeEvent } from '@mui/material';

type InterviewSlice = {
  id: number;
  value: number;
  label: string;
  color: string;
};

const chartDataByYear: Record<string, InterviewSlice[]> = {
  '2023': [
    { id: 0, value: 12000, label: 'Virtual', color: '#4caf50' },
    { id: 1, value: 10000, label: 'In-Person', color: '#ffa726' },
    { id: 2, value: 300, label: 'Walk-In', color: '#2e7d32' }, // ✅ green
  ],
  '2024': [
    { id: 0, value: 22000, label: 'Virtual', color: '#4caf50' },
    { id: 1, value: 15000, label: 'In-Person', color: '#ffa726' },
    { id: 2, value: 42, label: 'Walk-In', color: '#2e7d32' }, // ✅ green
  ],
  '2025': [
    { id: 0, value: 18000, label: 'Virtual', color: '#4caf50' },
    { id: 1, value: 13000, label: 'In-Person', color: '#ffa726' },
    { id: 2, value: 85, label: 'Walk-In', color: '#2e7d32' }, // ✅ green
  ],
};

export default function InterviewMethodDonutChart() {
  const [selectedYear, setSelectedYear] = React.useState<string>('2024');

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value);
  };

  const pieData = chartDataByYear[selectedYear] ?? [];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f9f7' }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 'bold', color: '#007A33' }}
      >
        🎯 Interview Method Breakdown
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold' }}>
          Select Year
        </Typography>
        <FormControl variant="standard">
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            value={selectedYear}
            onChange={handleYearChange}
            sx={{ minWidth: 120 }}
          >
            {Object.keys(chartDataByYear).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 80,
              outerRadius: 140,
              paddingAngle: 3,
              cornerRadius: 4,
              cx: 200,
              cy: 200,
              startAngle: 90, 
            },
          ]}
          width={400}
          height={400}
          slotProps={{
            legend: {
              position: { vertical: 'middle', horizontal: 'end' },
              sx: {
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                fontSize: '0.9rem',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}