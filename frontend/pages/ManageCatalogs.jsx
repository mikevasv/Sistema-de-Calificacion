import React, { useState } from 'react';

export default function ManageCatalogs() {
  // Estado para Cursos
  const [codigoCurso, setCodigoCurso] = useState('');
  const [nombreCurso, setNombreCurso] = useState('');
  const [creditos, setCreditos] = useState('');

  // Estado para Catedráticos
  const [codigoCat, setCodigoCat] = useState('');
  const [nombresCat, setNombresCat] = useState('');
  const [apellidosCat, setApellidosCat] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCreateCourse = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        codigo_curso: codigoCurso, 
        nombre: nombreCurso, 
        creditos: parseFloat(creditos) 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al agregar curso');
    }

    setMessage({ type: 'success', text: 'Curso registrado con éxito' });
    setCodigoCurso('');
    setNombreCurso('');
    setCreditos('');
  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  }
};

  const handleCreateProfessor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/professors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_catedratico: codigoCat, nombres: nombresCat, apellidos: apellidosCat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al agregar catedrático');

      setMessage({ type: 'success', text: 'Catedrático registrado con éxito' });
      setCodigoCat('');
      setNombresCat('');
      setApellidosCat('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white space-y-8">
      <h1 className="text-3xl font-bold text-indigo-400">Gestión de Catálogos</h1>

      {message.text && (
        <div className={`p-4 rounded-xl text-center ${message.type === 'error' ? 'bg-red-500/10 border border-red-500 text-red-400' : 'bg-green-500/10 border border-green-500 text-green-400'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario de Curso */}
        <form onSubmit={handleCreateCourse} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Agregar Nuevo Curso</h2>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Código del Curso</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              value={codigoCurso}
              onChange={(e) => setCodigoCurso(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Nombre del Curso</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              value={nombreCurso}
              onChange={(e) => setNombreCurso(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Créditos</label>
            <input
              type="number"
              step="0.5"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-medium transition-colors">
            Guardar Curso
          </button>
        </form>

        {/* Formulario de Catedrático */}
        <form onSubmit={handleCreateProfessor} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Agregar Nuevo Catedrático</h2>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Código de Catedrático</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              value={codigoCat}
              onChange={(e) => setCodigoCat(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Nombres</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              value={nombresCat}
              onChange={(e) => setNombresCat(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Apellidos</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              value={apellidosCat}
              onChange={(e) => setApellidosCat(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-medium transition-colors">
            Guardar Catedrático
          </button>
        </form>
      </div>
    </div>
  );
}