import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ carne: '', nombres: '', apellidos: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert('Usuario registrado exitosamente');
      navigate('/login');
    } else {
      const data = await res.json();
      alert(data.error || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro de Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Carné"
            required
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            onChange={(e) => setFormData({ ...formData, carne: e.target.value })}
          />
          <input
            type="text"
            placeholder="Nombres"
            required
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellidos"
            required
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            required
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">
            Registrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-indigo-400 hover:underline">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}