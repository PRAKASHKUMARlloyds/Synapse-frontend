import React from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import type { SelectChangeEvent } from '@mui/material';

type InterviewStats = {
  year: string;
  virtual: number;
  inPerson: number;
  walkIn: number;
  totalHours: number;
  selectedHours: number;
};

const interviewData: InterviewStats[] = [
  { year: '2023', virtual: 12000, inPerson: 10000, walkIn: 300, totalHours: 18567, selectedHours: 1255 },
  { year: '2024', virtual: 22000, inPerson: 15000, walkIn: 42, totalHours: 30637, selectedHours: 1762 },
  { year: '2025', virtual: 18000, inPerson: 13000, walkIn: 85, totalHours: 25000, selectedHours: 1560 },
];

export default function InterviewDashboard() {
  const [selectedYear, setSelectedYear] = React.useState<string>('2024');
  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value);
  };

  const selectedStats = interviewData.find((d) => d.year === selectedYear) ?? interviewData[0];

  const pieData = [
    {
      id: 0,
      value: selectedStats.totalHours,
      label: 'Total Hours',
      color: '#4dabf5',
    },
    {
      id: 1,
      value: selectedStats.selectedHours,
      label: 'Productive Hours',
      color: '#66bb6a',
    },
  ];

  const xAxisConfig = [
    {
      scaleType: 'band' as const,
      data: interviewData.map((d) => d.year),
    },
  ];

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(135deg, #e3f2fd, #e8f5e9)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{
        fontWeight: 700,
        color: '#1b5e20',
        mb: 3,
        background: 'linear-gradient(to right, #43cea2, #185a9d)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        💼 Interview Analytics Dashboard
      </Typography>

      <Divider sx={{ mb: 4, borderColor: '#aed581' }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
        {/* Bar Chart Panel */}
        <Box sx={{ flex: '1 1 45%', minWidth: 320, height: 620 }}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 3,
              backdropFilter: 'blur(12px)',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(200,200,200,0.3)',
              transition: 'transform 0.3s ease',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:hover': {
                transform: 'scale(1.015)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e88e5', mb: 2 }}>
              📈 Method Trends Over Time
            </Typography>
            <BarChart
              series={[
                { data: interviewData.map((d) => d.virtual), label: 'Virtual', color: '#1e88e5' },
                { data: interviewData.map((d) => d.inPerson), label: 'In-Person', color: '#ffa726' },
                { data: interviewData.map((d) => d.walkIn), label: 'Walk-In', color: '#43a047' },
              ]}
              xAxis={xAxisConfig}
              yAxis={[{
                valueFormatter: (value: any) => `${Math.round(value / 1000)}k`,
              }]}
              width={440}
              height={400}
              slotProps={{
                legend: {
                  position: { vertical: 'bottom', horizontal: 'center' },
                },
              }}
              
            />
            *Disclaimer : The data presented is fictional and for demonstration purposes only.
          </Paper>
        </Box>

        {/* Donut Chart Panel */}
        <Box sx={{ flex: '1 1 45%', minWidth: 320, height: 620 }}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 3,
              backdropFilter: 'blur(12px)',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(200,200,200,0.3)',
              transition: 'transform 0.3s ease',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:hover': {
                transform: 'scale(1.015)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#66bb6a', mb: 2 }}>
              ⏳ Productivity Snapshot – {selectedYear}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
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
                  {interviewData.map((d) => (
                    <MenuItem key={d.year} value={d.year}>{d.year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <PieChart
              series={[{
                data: pieData,
                innerRadius: 120,
                outerRadius: 200,
                paddingAngle: 3,
                cornerRadius: 4,
                cx: 210,
                cy: 100,
              }]}
              width={420}
              height={420}
              slotProps={{
                legend: {
                  position: { vertical: 'middle', horizontal: 'end' },
                  sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    fontSize: '0.90rem',
                  },
                },
              }}
            />
              *Disclaimer : The data presented is fictional and for demonstration purposes only.
          </Paper>
         
        </Box>
      </Box>
     
    </Box>
  );
}