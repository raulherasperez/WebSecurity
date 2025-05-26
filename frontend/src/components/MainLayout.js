import React from 'react';
import SidebarMenu from './SidebarMenu';
import LogoHomeLink from './LogoHomeLink';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div className="App">
    <SidebarMenu />
    <LogoHomeLink />
    <main className="App-main" style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;