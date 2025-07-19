import * as React from 'react';
import {Box,Typography,FormControl,InputLabel,Select,MenuItem,} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

// Interview data by year

const rawData =[
  {
    year:'2024',
  totalInterviewHours:30637,
  selectedhours:1762,},

  {
    year:'2025',
    totalInterviewHours:25000,
  selectedhours:1560,
    
  }
];

export default function DonutChartWithDropdown () { 
  const [selectedYear, setSelectedYear] =React.useState(rawData[0].year);
  const handleYearChange = (event: SelectChangeEvent) => { 
  setSelectedYear(event.target.value);
  };

// Get data for selected year const current
  const current= rawData.find((d) => d.year === selectedYear) ?? {
    totalInterviewHours:0,
    selectedhours:0,
  };

const donutData = [
  {id:0,value:current.totalInterviewHours,label:'Total Interview Hours',color:'purple',},
  {id:1,value:current.selectedhours, label:'Selected Hours',color:'green',},
];


return (

  <Box sx={{ p: 4, fontweight: 'bold' ,backgroundColor: '#f5f9f7' ,mt:-10,ml:-10}}>
  <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#007A33',mt:-2}}>
        ⏳ Interview Hours Spend
  </Typography>

  <Box sx={{ display: 'flex-center', JustifyContent: 'center', mb:-1,mt:5}}>
      <Typography variant="h6" sx={{fontWeight:'bold' , color:'black',display:'flex',mr:2,mt:1.5,ml:4}}>Select year</Typography>
      <FormControl sx={{minwidth: 120, justifyContent:'center'}}>
        <InputLabel id="year-select-label">Year</InputLabel>
        <Select labelId="year-select-label" value={selectedYear} label="Year" onChange={handleYearChange}>
          {rawData.map((d) => (
            <MenuItem key={d.year} value={d.year}>
                  {d.year}
            </MenuItem>
          ))}
       </Select>
      </FormControl>
    </Box>

  <Box sx={{ display: 'flex', justifyContent: 'center', fontweight: 'bold', fontSize:20}}>
  <PieChart
    series={[
      {
        data: donutData,
        innerRadius: 88,
        outerRadius: 150,
        paddingAngle: 3,
        cornerRadius: 4,
        cx: 250,
        cy: 250, 
      },
    ]}
    width={450}
    height={500}
    slotProps={{
      legend: {
        position: { vertical: 'middle', horizontal: 'center' },
          sx: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '1rem',
            fontWeight: 10,
      },
    },
  }}
  
  />

    </Box>
  </Box>
);
}

