import React from 'react';
import { Page } from '@constellation/core';
import Login from '../components/customComponents/Login';

const LoginPage = () => {
  return (
    <div style={{ padding: '50px', backgroundColor: 'rgb(246, 243, 242)' }}>
      <Page>
        <Login />
      </Page>
    </div>
  );
};

export default LoginPage;
