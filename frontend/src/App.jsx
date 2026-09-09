import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RecoverPassword from '../pages/RecoverPassword';
import Feed from '../pages/Feed';
import CreatePost from '../pages/CreatePost';
import SearchProfile from '../pages/SearchProfile';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Sidebar from './components/Sidebar';
import ManageCatalogs from "../pages/ManageCatalogs";

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
        
        <Route path="/feed" element={<Layout><Feed /></Layout>} />
        <Route path="/create-post" element={<Layout><CreatePost /></Layout>} />
        <Route path="/search-profile" element={<Layout><SearchProfile /></Layout>} />
        <Route path="/profile/:carne" element={<Layout><Profile /></Layout>} />
        <Route path="/catalogs" element={<Layout><ManageCatalogs /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />        
      </Routes>
    </BrowserRouter>
  );
}