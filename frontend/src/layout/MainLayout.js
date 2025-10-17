import React from 'react';
import { Outlet } from 'react-router-dom';
// Bottom navigation removed per request

const MainLayout = () => (
  <div className="main-layout">
    <main className="content">
      <Outlet />
  </main>
  </div>
);

export default MainLayout;