import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedCatedratico, setSelectedCatedratico] = useState('');
  const [contenido, setContenido] = useState('');

  const now = new Date().toLocaleString();

  useEffect(() => {
    // Cargar catálogos de cursos y catedráticos
    fetch('http://localhost:5000/api/courses').then(res => res.json()).then(setCursos).catch(() => {});
    fetch('http://localhost:5000/api/professors').then(res => res.json()).then(setCatedraticos).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carne: user.carne,
        codigo_curso: selectedCurso,
        codigo_catedratico: selectedCatedratico,
        contenido
      })
    });

    if (res.ok) {
      alert('Publicación creada con éxito');
      navigate('/feed');
    } else {
      const data = await res.json();
      alert(data.error || 'Error al crear la publicación');
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white flex justify-center items-center">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">Crear Nueva Publicación</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold">Usuario</label>
              <input
                type="text"
                disabled
                value={`${user.nombres || ''} ${user.apellidos || ''} (${user.carne || ''})`}
                className="w-full mt-1 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold">Fecha y Hora</label>
              <input
                type="text"
                disabled
                value={now}
                className="w-full mt-1 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase font-semibold">Seleccionar Curso</label>
            <select
              required
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="">-- Elija un Curso --</option>
              {cursos.map(c => <option key={c.codigo_curso} value={c.codigo_curso}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase font-semibold">Seleccionar Catedrático</label>
            <select
              required
              value={selectedCatedratico}
              onChange={(e) => setSelectedCatedratico(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="">-- Elija un Catedrático --</option>
              {catedraticos.map(cat => (
                <option key={cat.codigo_catedratico} value={cat.codigo_catedratico}>
                  {cat.nombres} {cat.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase font-semibold">Mensaje de la Publicación</label>
            <textarea
              required
              rows="4"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe tu retroalimentación sobre el curso o catedrático..."
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition">
            Publicar Retroalimentación
          </button>
        </form>
      </div>
    </div>
  );
}