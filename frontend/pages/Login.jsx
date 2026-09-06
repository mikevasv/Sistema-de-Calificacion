import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [carne, setCarne] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carne, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/feed');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm font-medium">Carné</label>
            <input
              type="text"
              required
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors">
            Ingresar
          </button>
        </form>
        <div className="mt-6 flex justify-between text-sm text-indigo-400">
          <Link to="/register" className="hover:underline">Registrar usuario</Link>
          <Link to="/recover" className="hover:underline">Recuperar Contraseña</Link>
        </div>
      </div>
    </div>
  );
}