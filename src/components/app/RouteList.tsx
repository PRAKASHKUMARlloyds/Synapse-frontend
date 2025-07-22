import { Route, Routes } from 'react-router-dom';
import ManagerDashboard from '../../pages/ManagerDashboard';

import Dashboard from '../../pages/admin/Dashboard';
import Candidates from '../../pages/admin/CandidateTables';
import Schedule from '../../pages/admin/Schedule';
import Feedback from '../../pages/admin/Feedback';

import ChatInterface from '../../pages/ChatInterface';
import CodeEditor from '../editorComponents/CodeEditor';
import AdminLayout from '../../pages/admin/AdminLayout';
import LoginPage from '../../pages/LoginPage';
import UserDashboard from '../../pages/UserDashboard';
import HRDashboard from '../../pages/HRDashboard';
import ResumeAnalysis from '../../pages/ResumeAnalysis'

export const RoutesList = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/analyse" element={<ResumeAnalysis />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/ChatInterface" element={<ChatInterface />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="analyse" element={<ResumeAnalysis />} />
        </Route>
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
    </div>
  );
};
