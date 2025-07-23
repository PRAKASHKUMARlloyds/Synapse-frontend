import  React from 'react';
import {Box,Typography,} from '@mui/material';
import {styled} from '@mui/material';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip} from '@mui/x-charts';
import Slider from '@mui/material/Slider';
import { useAnimate } from '@mui/x-charts';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import type { BarLabelProps } from '@mui/x-charts/BarChart';


const rawData=[{year:'2024',sel:2350,rej:19650},{year:'2025',sel:1500,rej:16500}]
const allYears =rawData.map((d) => parseInt(d.year));
const minYear = Math.min(...allYears);
const maxYear = Math.max(...allYears);
const yearMarks = allYears.map((year) => ({
              value: year, 
              label: year.toString(), 
          }));

const legendItems = [
        { label: 'Selected', color: '#52b202' },
        { label: 'Rejected', color: '#b2102f' },
      ];

function CustomLegend() {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', justifyContent: 'center' }}>
      {legendItems.map((item) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px',color:'black' }}>
          <div style={{width: 14,height: 14,backgroundColor: item.color,borderRadius: '2px',}} />
          <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
    </div>
  ))}
  </div>
);}

export const InterviewStatsPanel: React.FC = () => {const [yearRange, setYearRange] = React.useState<[number, number]> ([minYear, maxYear]);
const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    setYearRange(newValue as [number, number]);
};

const filteredData= rawData.filter((d) => {
    const year= parseInt(d.year);
    return year >= yearRange[0] && year <= yearRange[1];
  });

const sel =filteredData.map((d) => d.sel);
const rej =filteredData.map((d) => d.rej);
const xLabels =filteredData.map((d) => d.year);

function BarLabel (props: BarLabelProps) {
const {
seriesId,
dataIndex,
x,
y,
width,
yOrigin,
skipAnimation,
} = props;


const animatedProps = useAnimate(
  {x: x + width / 2, y: y-8},
  {
    initialProps: {x: x + width / 2, y: yOrigin},
    createInterpolator: interpolateObject,
    transformProps: (p) => p,
    applyProps: (element: SVGTextElement, p) => {
      element.setAttribute('x', p.x.toString());
      element.setAttribute('y', p.y.toString());
    },
skip: skipAnimation,
}, );


if (seriesId !== 'rej') return null;

const match =filteredData[dataIndex];
const total=(match?.sel ?? 0) + (match?.rej?? 0);
return (
 <Text {...animatedProps}> {total} </Text>);
} 
return (
 <Box sx={{ px: { xs: 2, sm: 4 }, py: 2, backgroundColor: '#f5f9f7',mt:-10,ml:-20 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#007A33' }}>
        📊 Interview Metrics Overview
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
        <div style={{ margin: '10px 12px' }}>
          <Slider
              value={yearRange}
              onChange={handleRangeChange}
              valueLabelDisplay="auto"
              step={1}
              marks ={yearMarks}
              min={minYear}
              max={maxYear}
            />

        </div>
        <CustomLegend/>
        <ChartContainer
            xAxis={[{ scaleType: 'band', data: xLabels, barGapRatio:0,categoryGapRatio:0.2}]}
            series={[
                  { type: 'bar', id: 'sel', data: sel, stack: 'total', color: '#52b202',label: 'selected'}, { type: 'bar', id: 'rej', data: rej, stack: 'total', color: '#b2102f',label: 'rejected'},
              ]} 
            height={350}
            width={500}
            yAxis={[{scaleType: 'linear', width: 70,label: 'Total Interviews'}]}
            margin={{ left: 10, right: 0}}
        >
        <BarPlot barLabel="value" slots={{ barLabel: BarLabel }} />
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsTooltip />
       </ChartContainer>
      </Box>  
</Box>
  );
};
const Text = styled('text') (({theme}) => ({
...theme?.typography?.body2,
stroke: 'none',
fill: (theme.vars || theme)?.palette?.text?.primary,
transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
textAnchor: 'middle',
dominantBaseline: 'central',
pointerEvents: 'none',
}));
export default InterviewStatsPanel;
