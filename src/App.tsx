import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Schedule from './pages/admin/Schedule';
import Feedback from './pages/admin/Feedback';
import CandidateTable from './pages/admin/CandidateTables';
import './App.css';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          {<Route path="feedback" element={<Feedback />} /> }
          <Route path="candidates" element={<CandidateTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;