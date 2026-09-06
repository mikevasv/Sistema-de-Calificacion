import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RecoverPassword from '../pages/RecoverPassword';
import Feed from '../pages/Feed';
import Sidebar from './components/Sidebar';

function Layout({ children }) {
  return (
    <div className="flex bg-slate-900 min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover" element={<RecoverPassword />} />
        
        <Route
          path="/feed"
          element={
            <Layout>
              <Feed />
            </Layout>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}