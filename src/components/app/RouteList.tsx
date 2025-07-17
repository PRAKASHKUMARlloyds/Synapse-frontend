import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../pages/LoginPage';

import UserDashboard from 'src/pages/UserDashboard';
import ManagerDashboard from 'src/pages/ManagerDashboard';
import HRDashboard from 'src/pages/HRDashboard';
import ChatInterface from 'src/pages/ChatInterface';
import AdminLayout from 'src/pages/admin/AdminLayout';
import Dashboard from '../../pages/admin/Dashboard';
import Candidates from '../../pages/admin/CandidateTables';
import Schedule from '../../pages/admin/Schedule';
import Feedback from '../../pages/admin/Feedback';
import CodeEditor from 'src/components/editor/CodeEditor';

export const RoutesList = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/ChatInterface" element={<ChatInterface />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
    </div>
  );
};
