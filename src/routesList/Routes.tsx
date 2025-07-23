import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../src/pages/admin/AdminLayout';
import Dashboard from '../../src/pages/admin/Dashboard';
// import Schedule from '../../src/pages/admin/Shedule';
// import Feedback from '../../src/pages/admin/Feedback';
// import CandidateTable from '../../src/pages/admin/CandidateTables';

const AdminRoutes = () => (
  <Routes>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      {/* <Route path="schedule" element={<Schedule />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="candidates" element={<CandidateTable />} /> */}
    </Route>
  </Routes>
);

export default AdminRoutes;