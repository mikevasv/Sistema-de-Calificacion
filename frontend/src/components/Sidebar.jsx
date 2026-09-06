import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen p-4 flex flex-col justify-between text-slate-200">
      <div>
        <div className="mb-8 px-2">
          <h2 className="text-xl font-bold text-indigo-400">Plataforma Auxiliares</h2>
          <p className="text-xs text-slate-400 mt-1">Carné: {user.carne || 'Invitado'}</p>
        </div>

        <nav className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase px-2 mb-1">Menú Principal</div>
          <Link to="/feed" className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition">
            Muro de Publicaciones
          </Link>
          <Link to="/create-post" className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition">
            Crear Publicación
          </Link>

          <div className="text-xs font-semibold text-slate-500 uppercase px-2 mt-6 mb-1">Perfiles</div>
          <Link to="/search-profile" className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition">
            Buscar Perfil
          </Link>
          <Link to={`/profile/${user.carne}`} className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition">
            Gestión Cursos Aprobados
          </Link>

          <div className="text-xs font-semibold text-slate-500 uppercase px-2 mt-6 mb-1">Información</div>
          <Link to="/about" className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition">
            Acerca de
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white py-2 rounded-lg transition font-medium text-sm"
      >
        Cerrar Sesión
      </button>
    </aside>
  );
}