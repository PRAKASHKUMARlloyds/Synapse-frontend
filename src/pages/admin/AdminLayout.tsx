import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';

const AdminLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Toolbar />
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: '#f5f5f5',
                        fontFamily: 'Segoe UI, Roboto, Helvetica Neue, sans-serif',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;