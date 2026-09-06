import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const { carne } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = String(loggedUser.carne) === String(carne);

  const [userInfo, setUserInfo] = useState({ nombres: '', apellidos: '', email: '' });
  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [catalogCursos, setCatalogCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [nota, setNota] = useState('');

  useEffect(() => {
    fetchProfileData();
    fetchCursosCatalog();
  }, [carne]);

  const fetchProfileData = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${carne}`);
    if (res.ok) {
      const data = await res.json();
      setUserInfo(data.usuario);
      setCursosAprobados(data.cursosAprobados || []);
    }
  };

  const fetchCursosCatalog = async () => {
    const res = await fetch('http://localhost:5000/api/courses');
    if (res.ok) {
      const data = await res.json();
      setCatalogCursos(data);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    const res = await fetch(`http://localhost:5000/api/users/${carne}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo)
    });
    if (res.ok) alert('Datos actualizados correctamente');
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/users/${carne}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo_curso: selectedCurso, nota })
    });
    if (res.ok) {
      fetchProfileData();
      setSelectedCurso('');
      setNota('');
    }
  };

  const handleDeleteCourse = async (id) => {
    const res = await fetch(`http://localhost:5000/api/users/${carne}/courses/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) fetchProfileData();
  };

  const totalCreditos = cursosAprobados.reduce((acc, curr) => acc + parseFloat(curr.creditos || 0), 0);

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white space-y-8">
      {/* Datos Personales */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-indigo-400">
          Perfil de Usuario {isOwner ? '(Mi Cuenta)' : ''}
        </h2>
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">Carné (No editable)</label>
            <input type="text" disabled value={carne} className="w-full mt-1 p-3 bg-slate-700/50 border border-slate-600 rounded text-slate-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs text-slate-400">Correo Electrónico</label>
            <input
              type="email"
              disabled={!isOwner}
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Nombres</label>
            <input
              type="text"
              disabled={!isOwner}
              value={userInfo.nombres}
              onChange={(e) => setUserInfo({ ...userInfo, nombres: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Apellidos</label>
            <input
              type="text"
              disabled={!isOwner}
              value={userInfo.apellidos}
              onChange={(e) => setUserInfo({ ...userInfo, apellidos: e.target.value })}
              className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded text-white disabled:opacity-50"
            />
          </div>
          {isOwner && (
            <div className="col-span-2">
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition">
                Actualizar Mis Datos
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Cursos Aprobados */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-400">Cursos Aprobados</h2>
          <span className="bg-indigo-900/50 border border-indigo-500 text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
            Créditos Acumulados: {totalCreditos}
          </span>
        </div>

        {isOwner && (
          <form onSubmit={handleAddCourse} className="flex gap-3 mb-6 bg-slate-700/40 p-4 rounded-xl border border-slate-700">
            <select
              required
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
              className="flex-1 p-2.5 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            >
              <option value="">-- Seleccionar Curso a Aprobar --</option>
              {catalogCursos.map(c => <option key={c.codigo_curso} value={c.codigo_curso}>{c.nombre} ({c.creditos} crd)</option>)}
            </select>
            <input
              type="number"
              step="0.1"
              placeholder="Nota"
              required
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="w-24 p-2.5 bg-slate-700 border border-slate-600 rounded text-white text-sm"
            />
            <button type="submit" className="px-5 bg-green-600 hover:bg-green-500 text-white rounded font-medium text-sm transition">
              Agregar
            </button>
          </form>
        )}

        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-700/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Nombre del Curso</th>
              <th className="p-3 text-center">Créditos</th>
              <th className="p-3 text-center">Nota</th>
              {isOwner && <th className="p-3 text-right">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {cursosAprobados.map((item) => (
              <tr key={item.id}>
                <td className="p-3 font-mono">{item.codigo_curso}</td>
                <td className="p-3">{item.nombre}</td>
                <td className="p-3 text-center">{item.creditos}</td>
                <td className="p-3 text-center font-bold text-indigo-400">{item.nota}</td>
                {isOwner && (
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteCourse(item.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}