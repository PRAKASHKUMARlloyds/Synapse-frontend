import DonutChartWithDropdown from "./InterviewHoursPieChart";
import InterviewStatsPanel from "./InterviewBarChart";
import { Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Interview Analytics Dashboard
      </Typography>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'space-between',
        }}
      >
        {/* Bar Chart Panel */}
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <InterviewStatsPanel />
        </div>

        {/* Donut Chart Panel */}
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <DonutChartWithDropdown />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
