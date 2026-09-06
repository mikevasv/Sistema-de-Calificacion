import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RecoverPassword() {
  const [step, setStep] = useState(1);
  const [carne, setCarne] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleValidate = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const res = await fetch('http://localhost:5000/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carne, email, newPassword })
    });
    if (res.ok) {
      alert('Contraseña actualizada correctamente');
      navigate('/login');
    } else {
      const data = await res.json();
      alert(data.error || 'Validación fallida');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Recuperar Contraseña</h2>
        {step === 1 ? (
          <form onSubmit={handleValidate} className="space-y-4">
            <input
              type="number"
              placeholder="Carné"
              required
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg">
              Validar
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              required
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Nueva Contraseña"
              required
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg">
              Actualizar Contraseña
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-indigo-400 hover:underline">Volver a inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}