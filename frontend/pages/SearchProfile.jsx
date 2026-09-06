import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchProfile() {
  const [carneQuery, setCarneQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (carneQuery.trim()) {
      navigate(`/profile/${carneQuery}`);
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white flex justify-center items-start pt-20">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Buscador de Perfiles</h2>
        <p className="text-slate-400 text-sm mb-6">Ingresa el carné del estudiante para consultar sus datos y historial académico.</p>
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="number"
            placeholder="Ingrese Carné..."
            required
            value={carneQuery}
            onChange={(e) => setCarneQuery(e.target.value)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-lg focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition">
            Buscar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}